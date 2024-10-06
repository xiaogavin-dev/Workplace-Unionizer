// const getUnions = (req, res, next) => {
//     console.log("we hit getUnions endpoint")
//     return res.status(200).json({
//         status: 'success',
//         message: 'hit unions'
//     })
// }
// module.exports = { getUnions }

const pool = require('../db');

const getUnions = async (req, res, next) => {
  try {
    const { unionname } = req.query;

    let query = 'SELECT * FROM unions WHERE 1=1';
    const queryParams = [];

    if (unionname) {
      queryParams.push(`%${unionname}%`);
      query += ` AND name ILIKE $${queryParams.length}`; // Using ILIKE for case-insensitive search
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: 'No unions found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching unions: ', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching unions.',
    });
  }
};

module.exports = { getUnions };