const dotenv = require('dotenv').config(); // Should be at the very top
const connectDB = require('./src/config/db');
const app = require('./src/app'); // Import the Express app

const port = process.env.PORT || 5000;
// Connect to MongoDB Atlas
connectDB();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});