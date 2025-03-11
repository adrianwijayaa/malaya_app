require("dotenv").config(); // Load .env file

module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.PG_USER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: process.env.DB_DIALECT,
  },
};
