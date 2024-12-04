const {
    union,
    workplace
} = require('../models');
const {
    v4: uuidv4
} = require('uuid');

const createUnion = async (req, res) => {
    try {
        const {
            name,
            description,
            visibility,
            workplaces,
            userId
        } = req.body;

        // Check if the required fields are provided
        if (!name || !description || !visibility || !userId) {
            return res.status(400).json({
                message: "All fields are required."
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

        const newUnion = await union.create({
            id: uuidv4(),
            name,
            description,
            visibility,
            image: imagePath, // Store the uploaded image path
        }, {
            userId
        });

        // Loop through each workplace and insert individually
        for (const wp of parsedWorkplaces) {
            const workplaceData = {
                ...wp,
                id: uuidv4(), // Generate a unique ID for each workplace
                unionId: newUnion.id, // Associate with the new union
            };

            // Insert the workplace record into the database
            await workplace.create(workplaceData);
        }

        return res.status(201).json({
            status: "success",
            id: newUnion.id,
            data: newUnion,
        });
    } catch (error) {
        console.error('Error creating union:', error);
        return res.status(500).json({
            status: "error",
            message: "Union creation failed."
        });
    }
};

module.exports = {
    createUnion
};