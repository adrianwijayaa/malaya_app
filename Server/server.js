const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Set CORS options
var corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Import routes
const router = require("./src/routes/index.js");
app.use("/api/v1", router);

// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
