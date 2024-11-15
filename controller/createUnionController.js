const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const { union, user_union } = require('../models/index');

const createUnion = async (req, res) => {
  try {
    const {
      name,
      description,
      visibility,
      workplaces,
      image,
      userId
    } = req.body;

    if (!userId) {
      console.warn("Warning: User ID not provided in request body.");
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!name || !description || !visibility) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    let parsedWorkplaces;
    if (typeof workplaces === 'string') {
      try {
        parsedWorkplaces = JSON.parse(workplaces);
      } catch (error) {
        console.error("Error parsing workplaces JSON:", error);
        return res.status(400).json({ message: "Invalid workplaces format." });
      }
    } else {
      parsedWorkplaces = workplaces;
    }

    if (!Array.isArray(parsedWorkplaces)) {
      return res.status(400).json({ message: "Workplaces must be an array." });
    }

    const unionId = uuidv4();

    // Create the union
    const newUnion = await union.create({
      id: unionId,
      name,
      description,
      visibility,
      workplaces: parsedWorkplaces, 
      image: image || null, 
    });

    //add the user as an admin to the union
    await user_union.create({
      id: uuidv4(),
      userId,
      role: 'admin',
      unionId: unionId,
    });

    console.log("New Union Created:", { id: unionId, data: newUnion });
    res.status(201).json({
      status: "success",
      id: unionId, 
      data: newUnion,
    });
  } catch (error) {
    console.error("Error creating union:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An unexpected error occurred while creating the union.",
    });
  }
};

module.exports = {
  createUnion,
};
