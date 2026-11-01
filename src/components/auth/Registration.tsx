"use client";
import { motion, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";

import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  ArrowUpRight,
  Compass,
  CalendarDays,
  UsersRound,
  UserRoundPen,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNameError("");
    setPasswordError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Name cannot be empty");
      return;
    }

    if (trimmedName.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }

    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(trimmedName)) {
      setNameError("Name can only contain letters and spaces");
      return;
    }

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one capital letter");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError(
        "Password must contain at least one special character(!@#$%^&*)",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }
  };
  return (
    <section className="section">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#F5EBD0] p-12 lg:p-6"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-45 border-[#B11226]/5"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-28 -bottom-28 h-80 w-80 rounded-full border-45 border-[#B11226]/5"
          ></motion.div>

          <motion.div
            variants={springItem as Variants}
            className="relative z-10"
          >
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B11226] text-xl font-black text-white shadow-lg">
                S
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-black/70">
                uvidha<span className="text-[#B11226]">.</span>
              </span>
            </Link>
          </motion.div>

          <div className="relative z-10  space-y-3">
            <motion.p
              variants={springItem as Variants}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]"
            >
              <span className="h-2 w-2 rounded-full bg-[#B11226]" />
              Get started with Suvidha
            </motion.p>

            <motion.h1
              variants={springItem as Variants}
              className="max-w-lg text-4xl font-bold leading-[1.15] tracking-tight text-[#292524] lg:text-5xl"
            >
              A simpler everyday
              <span className="block text-[#B11226]">
                starts with one small step.
              </span>
            </motion.h1>

            <motion.p
              variants={springItem as Variants}
              className="max-w-md text-base leading-8 text-black/55"
            >
              Create your account and discover a better way to connect with the
              local services that keep your life moving.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-5 pt-5"
            >
              {[
                {
                  icon: Compass,
                  title: "Everything closer to you",
                  desc: "Explore local services in your neighbourhood.",
                },
                {
                  icon: CalendarDays,
                  title: "Convenience on your terms",
                  desc: "Manage your service visits with ease.",
                },
                {
                  icon: UsersRound,
                  title: "Be part of something local",
                  desc: "Connect with trusted services around you.",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={index}
                    variants={springItem as Variants}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#B11226] group-hover:text-white">
                      <Icon
                        size={21}
                        className="text-[#B11226] group-hover:text-white"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-black/75">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-black/45">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-black/40">
            <p>© 2026 Suvidha. All rights reserved.</p>
            <span className="font-semibold tracking-widest">MADE FOR YOU.</span>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}

        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-1 md:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B11226] text-xl font-black text-white">
              S
            </span>
            <span className="text-2xl font-extrabold text-black/70">
              uvidha<span className="text-[#B11226]">.</span>
            </span>
          </Link>

          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B11226]">
              Welcome to suvidha
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-[#292524]">
              Create
              <span className="block text-[#B11226]">your account.</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-black/45">
              Join Suvidha and make everyday services simpler.{" "}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-black/65"
              >
                Your Name
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAF9] px-4 transition-all duration-200 focus-within:border-[#B11226] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B11226]/10">
                <UserRoundPen
                  size={18}
                  className="text-black/30 group-focus-within:text-[#B11226]"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "name-error" : undefined}
                  placeholder="Your full"
                  className="w-full bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/30"
                />
              </div>
              {nameError && (
                <p id="name-error" className="text-sm text-[#B11226]">
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-black/65"
              >
                Email address
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAF9] px-4 transition-all duration-200 focus-within:border-[#B11226] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B11226]/10">
                <Mail
                  size={18}
                  className="text-black/30 group-focus-within:text-[#B11226]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-black/65"
                >
                  Password
                </label>
              </div>

              <div className="group flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAF9] px-4 transition-all duration-200 focus-within:border-[#B11226] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B11226]/10">
                <LockKeyhole
                  size={18}
                  className="text-black/30 group-focus-within:text-[#B11226]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-black/35 transition-colors hover:text-[#B11226]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-sm text-[#B11226]">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-black/65"
              >
                Confirm password
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAF9] px-4 transition-all duration-200 focus-within:border-[#B11226] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B11226]/10">
                <LockKeyhole
                  size={18}
                  className="text-black/30 group-focus-within:text-[#B11226]"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="w-full bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/30"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-black/35 transition-colors hover:text-[#B11226]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#B11226] py-4 font-semibold text-white shadow-lg shadow-[#B11226]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#930F20] hover:shadow-xl active:scale-[0.98]"
            >
              <span>Create Account</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-black/45">
              Already have an account?{" "}
              <Link
                href="/login"
                className="group font-bold text-[#B11226] hover:underline"
              >
                Login
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-200  ml-0.5 inline"
                />
              </Link>
            </p>
          </div>

          <p className="mt-12 text-center text-[11px] text-black/30">
            Your everyday services, made simpler with Suvidha.
          </p>
        </div>
      </div>
    </section>
  );
}
