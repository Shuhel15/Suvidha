import OTPVerifyForm from "@/components/auth/OTPVerify";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Verify OTP",
  description:
    "Verify your Suvidha account by entering the OTP sent to your registered email or phone number.",

    alternates: {
      canonical: "/otp-verify",
    },
    robots:{
      index: false,
      follow: false,
    }
}

export default function OTPVerifyPage() {
  return (
    <main>
      <OTPVerifyForm/>
    </main>
  )
}