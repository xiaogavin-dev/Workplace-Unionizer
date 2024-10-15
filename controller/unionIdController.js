const pool = require('../db');

const getUnionById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        // Query the database for the specific union by its ID
        const query = 'SELECT * FROM unions WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Union not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: result.rows[0], // Return the specific union data
        });
    } catch (error) {
        console.error('Error fetching union by ID: ', error);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the union by ID.',
        });
    }
};

module.exports = {
    getUnionById
};