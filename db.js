const { Pool } = require('pg');

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USERNAME, // Replace with your PostgreSQL username
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // Replace with your database name
  password: process.env.DB_PASSWORD, // Replace with your PostgreSQL password
  port: process.env.DB_PORT, // Default PostgreSQL port
});

// Export the pool to be used in other files
module.exports = pool;


