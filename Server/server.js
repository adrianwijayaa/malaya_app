const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5432",
    "https://demalayaapp-production.up.railway.app",
    "https://demalayaaa-production.up.railway.app",
    "https://demalaya-app.vercel.app",
    "https://malayaadventures.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

const router = require("./src/routes/index.js");
app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
