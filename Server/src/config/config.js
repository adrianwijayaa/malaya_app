require("dotenv").config();

const base = {
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  dialect: process.env.DB_DIALECT || "postgres",
  logging: false,
};

module.exports = {
  development: { ...base },
  test: { ...base },
  production: { ...base },
};
