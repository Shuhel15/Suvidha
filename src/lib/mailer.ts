import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"Suvidha" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP for Suvidha",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px;">
        <h2 style="color: #B11226;">Welcome to Suvidha!</h2>
        <p>Use the OTP below to verify your email address.</p>
        <h1 style="letter-spacing: 8px; color: #B11226;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}
