
"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { springItem, staggerContainer } from "../layout/animation";

const OTP_LENGTH = 6;

export default function OTPVerifyForm() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];

    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedOtp) return;

    const nextOtp = Array(OTP_LENGTH).fill("");

    pastedOtp.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    inputRefs.current[
      Math.min(pastedOtp.length, OTP_LENGTH - 1)
    ]?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/otp-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Invalid OTP. Please try again.");
        return;
      }

      toast.success("Email verified successfully!");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/10 md:grid-cols-2"
      >
        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#F5EBD0] p-10 md:flex lg:p-12">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-45 border-[#B11226]/5" />

          <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full border-45 border-[#B11226]/5" />

          <motion.div variants={springItem as Variants} className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B11226] text-xl font-black text-white shadow-lg">
                S
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-black/70">
                uvidha<span className="text-[#B11226]">.</span>
              </span>
            </Link>
          </motion.div>

          <div className="relative z-10 my-10 space-y-5">
            <motion.p
              variants={springItem as Variants}
              className="text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]"
            >
              Your time. Your convenience.
            </motion.p>

            <motion.h1
              variants={springItem as Variants}
              className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-[#292524] lg:text-5xl"
            >
              One step closer to a{" "}
              <span className="text-[#B11226]">simpler everyday.</span>
            </motion.h1>

            <motion.p
              variants={springItem as Variants}
              className="font-custom max-w-md text-base leading-8 text-black/55"
            >
              Just verify your email to get started with Suvidha and discover
              a better way to manage everyday local services.
            </motion.p>
          </div>

          <motion.div
            variants={springItem as Variants}
            className="relative z-10 flex items-center justify-between text-xs text-black/40"
          >
            <p>© 2026 Suvidha. All rights reserved.</p>
            <span className="font-semibold tracking-widest">MADE FOR YOU.</span>
          </motion.div>
        </div>

        {/* Right Side */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16"
        >
          <motion.div
            variants={springItem as Variants}
            className="mb-10 md:hidden"
          >
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B11226] text-2xl  font-black ">
                S
              </span>
              <span className="text-2xl font-extrabold text-black/70">
                uvidha<span className="text-[#B11226]">.</span>
              </span>
            </Link>
          </motion.div>

          <div className="mb-10">
            <motion.p
              variants={springItem as Variants}
              className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B11226]"
            >
              Email verification
            </motion.p>

            <motion.h2
              variants={springItem as Variants}
              className="text-4xl font-bold tracking-tight text-[#292524]"
            >
              Verify your
              <span className="block text-[#B11226]">email address.</span>
            </motion.h2>

            <motion.p
              variants={springItem as Variants}
              className="font-custom mt-4 text-sm leading-6 text-black/45"
            >
              We&apos;ve sent a 6-digit verification code to your email.
              Enter the code below to activate your account.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div variants={springItem as Variants} className="space-y-3">
              <label className="text-sm font-semibold text-black/65">
                Enter verification code
              </label>

              <div className="flex gap-2 sm:gap-3" role="group" aria-label="OTP code">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={loading}
                    onChange={(event) =>
                      updateDigit(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    aria-label={`OTP digit ${index + 1}`}
                    className="h-14 w-full rounded-xl border border-black/10 bg-[#FAFAF9] text-center text-xl font-bold text-[#292524] outline-none transition-all focus:border-[#B11226] focus:bg-white focus:ring-4 focus:ring-[#B11226]/10 disabled:opacity-50"
                  />
                ))}
              </div>
            </motion.div>

            <motion.button
              variants={springItem as Variants}
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#B11226] py-4 font-semibold text-white shadow-lg shadow-[#B11226]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#930F20] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify email"}
              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </motion.button>
          </form>

          <motion.p
            variants={springItem as Variants}
            className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-black/40"
          >
            <Mail size={14} />
            Check your spam folder if you can&apos;t find the email.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
