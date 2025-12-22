const admin = require('../config/firebase');

const sendNotification = async (tokens, title, body, data = {}) => {
  if (!tokens || tokens.length === 0) return;

  // Filter out empty/null tokens
  const validTokens = tokens.filter(t => t);
  
  if (validTokens.length === 0) return;

  const message = {
    notification: { title, body },
    data,
    tokens: validTokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Successfully sent ${response.successCount} notifications`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = { sendNotification };