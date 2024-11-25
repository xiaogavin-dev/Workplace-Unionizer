const {
  v4: uuidv4
} = require('uuid');
const {
  union,
  user_union,
  workplace
} = require('../models/index'); // Ensure Workplace model is imported

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

    // Validate required fields
    if (!userId) {
      console.warn("Warning: User ID not provided in request body.");
      return res.status(400).json({
        message: "User ID is required."
      });
    }
    if (!name || !description || !visibility) {
      return res.status(400).json({
        message: "Please fill in all required fields."
      });
    }

    // Parse workplaces if it's a JSON string
    let parsedWorkplaces;
    if (typeof workplaces === 'string') {
      try {
        parsedWorkplaces = JSON.parse(workplaces);
      } catch (error) {
        console.error("Error parsing workplaces JSON:", error);
        return res.status(400).json({
          message: "Invalid workplaces format."
        });
      }
    } else {
      parsedWorkplaces = workplaces;
    }

    const unionId = uuidv4();

    const newUnion = await union.create({
      id: unionId,
      name,
      description,
      visibility,
      image: image || null,
    }, {
      userId
    });

    // // Add the user as an admin to the union
    // await user_union.create({
    //   id: uuidv4(),
    //   userId,
    //   role: 'admin',
    //   unionId: unionId,
    // });

    // console.log("Union created successfully with ID:", newUnion.id);

    // Loop through each workplace and insert individually
    for (const wp of parsedWorkplaces) {
      const workplaceData = {
        ...wp,
        id: uuidv4(), // Generate a unique ID for each workplace
        unionId: newUnion.id, // Associate with the new union
      };

      // Insert the workplace record into the database
      await workplace.create(workplaceData);
      console.log("Inserted workplace:", workplaceData);
    }

    // Respond with success
    res.status(201).json({
      status: "success",
      id: newUnion.id,
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