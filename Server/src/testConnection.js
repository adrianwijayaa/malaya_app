const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 60000, // 60 seconds
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // timeout after 60s
    idle: 10000, // connection can be idle for 10s
    evict: 1000, // run cleanup every second
    handleDisconnects: true,
  },
  retry: {
    max: 3, // maximum retry attempts
    timeout: 60000, // timeout for each retry
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeConnectionTimedOutError/,
      /ETIMEDOUT/,
    ],
  },
  logging: console.log, // enable logging to debug connection issues
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

      // Wait for 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// Verify DATABASE_URL before attempting connection
console.log("Checking environment variables...");
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables!");
  process.exit(1);
}

console.log("Starting connection test...");
testConnection();
