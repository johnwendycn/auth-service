const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  } : undefined,
});

module.exports = {
  transporter,
  from: process.env.SMTP_FROM || 'no-reply@example.com',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
};
