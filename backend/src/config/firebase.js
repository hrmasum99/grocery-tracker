const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Ensure env vars are loaded if this file is run independently
dotenv.config(); 

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // REPLACE literal '\n' with actual newlines to make the key valid
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin Initialized Successfully');
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error);
}

module.exports = admin;