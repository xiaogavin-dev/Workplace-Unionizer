const { union, workplace, formQuestion } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../models'); // Import sequelize to handle transactions

const createUnion = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
        const { name, description, visibility, workplaces, userId } = req.body;

        // Check if the required fields are provided
        if (!name || !description || !visibility || !userId) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        // Retrieve image path if uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        let parsedWorkplaces;
        if (typeof workplaces === 'string') {
            try {
                parsedWorkplaces = JSON.parse(workplaces);
            } catch (error) {
                console.error("Error parsing workplaces JSON:", error);
                return res.status(400).json({
                    message: "Invalid workplaces format.",
                });
            }
        } else {
            parsedWorkplaces = workplaces;
        }
        const unionId = uuidv4()
        // Create the union record
        const newUnion = await union.create(
            {
                id: unionId,
                name,
                description,
                visibility,
                image: imagePath,
            },
            { transaction, userId } // Pass transaction and userId to the hook
        );
        // Loop through each workplace and insert individually
        for (const wp of parsedWorkplaces) {
            const workplaceData = {
                ...wp,
                id: uuidv4(), // Generate a unique ID for each workplace
                unionId: newUnion.id, // Associate with the new union
            };

            // Insert the workplace record into the database
            await workplace.create(workplaceData, { transaction, userId, unionId });
        }

        // Add default questions to the new union
        const defaultQuestions = [
            { questionText: "Which location do you work at?", unionId: newUnion.id },
            { questionText: "What is your job title?", unionId: newUnion.id },
            { questionText: "Who is your manager?", unionId: newUnion.id },
            { questionText: "How else can we contact you?", unionId: newUnion.id },
        ];

        await formQuestion.bulkCreate(defaultQuestions, { transaction });

        await transaction.commit(); // Commit the transaction

        return res.status(201).json({
            status: "success",
            id: newUnion.id,
            data: newUnion,
        });
    } catch (error) {
        console.error("Error creating union:", error);
        await transaction.rollback(); // Rollback the transaction on error
        return res.status(500).json({
            status: "error",
            message: "Union creation failed.",
        });
    }
};

module.exports = {
    createUnion,
};
