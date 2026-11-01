"use client";
import { motion, type Variants } from "framer-motion";
import { useState, type FormEvent } from "react";
import {
  ChartSpline,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  ArrowRight,
  Mail,
  LockKeyhole,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { staggerContainer, springItem } from "../layout/animation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error(data.error ?? "Unable to sign in. Please try again.");
        return;
      }

      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      console.error("An error occurred during login.", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <section className="section">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/10">
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#F5EBD0] p-12 lg:p-16">
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

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B11226] text-xl font-black text-white shadow-lg">
                S
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-black/70">
                uvidha<span className="text-[#B11226]">.</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 my-10 space-y-3">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]">
              <span className="h-2 w-2 rounded-full bg-[#B11226]" />
              Your time. Your convenience.
            </p>

            <h1 className="max-w-lg text-4xl font-bold leading-[1.15] tracking-tight text-[#292524] lg:text-5xl">
              Life gets busy.
              <span className="block text-[#B11226]">
                Your services shouldn&apos;t.
              </span>
            </h1>

            <p className="max-w-md text-base leading-8 text-black/55">
              From finding a nearby salon to tracking a repair, Suvidha brings
              everyday local services closer to you.
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-5 pt-5"
            >
              {[
                {
                  icon: MapPin,
                  title: "Discover local services",
                  desc: "Find trusted services around you.",
                },
                {
                  icon: Clock,
                  title: "Save your valuable time",
                  desc: "Skip unnecessary waiting queues.",
                },
                {
                  icon: ChartSpline,
                  title: "Stay updated",
                  desc: "Track appointments and service progress.",
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
        </div>

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
              Welcome back
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-[#292524]">
              Sign in to
              <span className="block text-[#B11226]">your account.</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-black/45">
              Good to see you again! Enter your details to continue.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#B11226] transition-colors hover:text-[#850D1D] hover:underline"
                >
                  Forgot password?
                </Link>
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
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 accent-[#B11226]"
              />
              <label htmlFor="remember" className="text-xs text-black/50">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#B11226] py-4 font-semibold text-white shadow-lg shadow-[#B11226]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#930F20] hover:shadow-xl active:scale-[0.98]"
            >
              <span>Sign in</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-black/45">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="group font-bold text-[#B11226] hover:underline"
              >
                Create account
                <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ml-0.5 inline" />
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
