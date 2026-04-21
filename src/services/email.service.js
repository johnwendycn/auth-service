// SERVICE: business logic only.
const { transporter, from, appBaseUrl } = require('../config/email');
const logger = require('../utils/logger');

async function send(to, subject, html) {
  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    logger.info('email.sent', { to, subject, messageId: info.messageId });
  } catch (err) {
    logger.error('email.failed', { to, subject, err: err.message });
    // Do not throw — email failure should not break the auth flow.
  }
}

module.exports = {
  async sendVerificationEmail(to, token) {
    const url = `${appBaseUrl}/api/auth/verify-email/${token}`;
    await send(to, 'Verify your email',
      `<p>Welcome! Click to verify your email:</p><p><a href="${url}">${url}</a></p>`);
  },
  async sendResetEmail(to, token) {
    const url = `${appBaseUrl}/reset-password/${token}`;
    await send(to, 'Reset your password',
      `<p>Reset your password:</p><p><a href="${url}">${url}</a></p><p>Link expires in 1 hour.</p>`);
  },
};
