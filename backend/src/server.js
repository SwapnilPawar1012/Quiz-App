// server.js
require("dotenv").config();
const app = require("./app"); // Import the app from step 1

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
