const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DBUSER,       // Database username
  host: process.env.HOST,       // AWS RDS/EC2 endpoint
  database: process.env.DATABASE,   // Name of your database
  password: process.env.DBPASSWORD, // Database password
  port: 5432,       // Typically 5432
  ssl: {
    rejectUnauthorized: false, // For secure AWS RDS connections
  },
});

pool.on('connect', () => {
  console.log("Connection pool established with Database")
})

module.exports = pool