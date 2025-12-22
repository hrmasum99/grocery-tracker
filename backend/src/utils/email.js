const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create Transporter (Using Gmail as an example)
  // For production, consider SendGrid, Mailgun, or AWS SES
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'host' and 'port' for other providers
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your App Password (not login password)
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: `Grocery Tracker <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3. Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;