const pool = require('../db');
const validStatuses = ['union', 'pending']; // Define valid status values
const { v4: uuidv4 } = require('uuid')
const { union, user_union } = require('../models/index');
const createUnion = async (req, res) => {
  try {
    const {
      name,
      location,
      status,
      organization,
      userId
    } = req.body;
    const unionId = uuidv4()
    // Check if the status is valid
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }
    // const query = `
    // INSERT INTO unions (id, name, location, status, organization, "createdAt", "updatedAt")
    // VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    // RETURNING *;
    // `;

    // const values = [id, name, location, status, organization];

    // const result = await pool.query(query, values);
    const newUnion = await union.create({ unionId, name, status, location, organization }, { userId })
    // const newUserUnion = await user_union.create({
    //   id: uuidv4(),
    //   userId: userId,
    //   role: 'admin',
    //   unionId: unionId,
    // })
    res.status(201).json({
      status: "success",
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
  createUnion
};