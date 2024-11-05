const pool = require('../db');
const validStatuses = ['union', 'pending']; // Define valid status values

const createUnion = async (req, res) => {
  try {
    const {
      name,
      location,
      status,
      organization
    } = req.body;

    // Check if the status is valid
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }

    const query = `
    INSERT INTO unions (name, location, status, organization, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *;
    `;

    const values = [name, location, status, organization];

    const result = await pool.query(query, values);

    res.status(201).json({
      status: "success",
      data: result.rows[0],
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