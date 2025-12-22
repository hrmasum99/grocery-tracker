// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); // Adjust path if needed
const connectDB = require('./src/config/db'); // Adjust path if needed

// Load env vars
dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Check if critical env vars are present
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.error("❌ Error: ADMIN_EMAIL or ADMIN_PASSWORD missing in .env file");
        process.exit(1);
    }

    // 1. Check if an admin already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      // 2. Create the Admin User using .env variables
      const adminUser = await User.create({
        name: process.env.ADMIN_NAME, // Fallback if name is missing
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, // Hashed automatically by User model
        role: 'admin',       // Hardcoded because this IS the admin seeder
        isVerified: true,    // Admin is auto-verified
        verificationToken: undefined
      });

      console.log('Admin User Created Successfully!');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: [HIDDEN] (Check your .env file)`);
    } else {
      console.log('Admin user already exists.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();