import nodemailer from 'nodemailer';

/**
 * Transactional email sender. Uses SMTP credentials from env.
 * Works with any SMTP provider (Resend, Postmark, SES, Gmail SMTP, etc.) —
 * just set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS in .env
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || 'INFO <no-reply@info.example.com>';

async function send(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.warn(`[email] SMTP not configured — skipping send to ${to}: "${subject}"`);
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, html });
}

export async function sendWelcomeEmail(to: string, name?: string) {
  await send(
    to,
    'Welcome',
    `<p>Hi ${name || 'there'},</p><p>Your account has been created. You're ready to access your report as soon as you complete your purchase.</p>`
  );
}

export async function sendPurchaseConfirmation(to: string, orderNumber: string, amountFormatted: string) {
  await send(
    to,
    'Your purchase is confirmed',
    `<p>Thanks for your purchase.</p><p><strong>Order:</strong> ${orderNumber}<br/><strong>Amount:</strong> ${amountFormatted}</p><p>Your download is ready in your dashboard.</p>`
  );
}

export async function sendDownloadLink(to: string, downloadUrl: string) {
  await send(
    to,
    'Your download link',
    `<p>Your report is ready.</p><p><a href="${downloadUrl}">Download your report</a></p><p>This link is unique to your order — please don't share it.</p>`
  );
}

export async function sendPasswordReset(to: string, resetUrl: string) {
  await send(
    to,
    'Reset your password',
    `<p>Click below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">Reset password</a></p>`
  );
}

export async function sendReceipt(to: string, orderNumber: string, amountFormatted: string, method: string) {
  await send(
    to,
    `Receipt — Order ${orderNumber}`,
    `<p>This confirms payment via ${method}.</p><p><strong>Order:</strong> ${orderNumber}<br/><strong>Amount:</strong> ${amountFormatted}</p>`
  );
}
