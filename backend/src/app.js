// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes directly here (for now)
app.get("/", (req, res) => {
  res.send("Backend is separated and running!");
});

app.get("/api/data", (req, res) => {
  res.json({
    message: "Hello from the separated app structure!",
    success: true,
  });
});

// Export the app instance
module.exports = app;
