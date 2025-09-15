const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
    evict: 1000,
    handleDisconnects: true,
  },
  retry: {
    max: 3,
    timeout: 60000,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeConnectionTimedOutError/,
      /ETIMEDOUT/,
    ],
  },
  logging: console.log,
});

async function testConnection() {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      console.log(`Connection attempt ${retries + 1} of ${maxRetries}...`);
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully!");
      return;
    } catch (error) {
      retries++;
      console.error(`❌ Connection attempt ${retries} failed:`, error.message);

      if (retries === maxRetries) {
        console.error("Max retries reached. Connection failed.");
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

console.log("Checking environment variables...");
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables!");
  process.exit(1);
}

console.log("Starting connection test...");
testConnection();
