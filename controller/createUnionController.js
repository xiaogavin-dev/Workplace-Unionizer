const { union, workplace } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createUnion = async (req, res) => {
    try {
        const { name, description, visibility, workplaces, userId } = req.body;

        // Check if the required fields are provided
        if (!name || !description || !visibility || !userId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Retrieve image path if uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newUnion = await union.create({
            id: uuidv4(),
            name,
            description,
            visibility,
            image: imagePath, // Store the uploaded image path
            workplaces: JSON.stringify(workplaces),
        },{userId});

        return res.status(201).json({ status: "success", data: newUnion });
    } catch (error) {
        console.error('Error creating union:', error);
        return res.status(500).json({ status: "error", message: "Union creation failed." });
    }
};

module.exports = { createUnion };
