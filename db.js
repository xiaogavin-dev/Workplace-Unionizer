const { Pool } = require('pg');

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: 'tony', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'unions', // Replace with your database name
  password: 'test123', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Export the pool to be used in other files
module.exports = pool;
