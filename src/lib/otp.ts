
import { randomInt, createHmac } from "crypto";

export function generateOTP(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashOTP(email: string, otp: string): string {
  const secret = process.env.OTP_SECRET;

  if (!secret) {
    throw new Error("OTP_SECRET is missing");
  }

  return createHmac("sha256", secret)
    .update(`${email}:${otp}`)
    .digest("hex");
}
