"use client";
import { MoveRight, TimerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { springItem, staggerContainer } from "../layout/animation";
import { useSession } from "next-auth/react";

export default function HeroSection() {
  const route = useRouter();
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;
  const accountType = session?.user?.accountType;

  const buttonText = !isLoggedIn
    ? "Register Your Business"
    : accountType === "BUSINESS_OWNER"
      ? "Your Businesses"
      : "Your Bookings";

  const handleBusinessClick = () => {
    if (status === "loading") return;

    if (!session) {
      route.push("/login");
    } else if (accountType === "BUSINESS_OWNER") {
      route.push("/owner/dashboard");
    } else {
      route.push("/customer/dashboard");
    }
  };

  const handleExploreServices = () => {
    if (status === "loading") return;

    if (session) {
      route.push("/services");
    } else {
      route.push("/login");
    }
  };

  return (
    <section className=" mt-40 ">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center gap-6 "
      >
        <motion.p variants={springItem as Variants} className="eye">
          <TimerIcon className="icons" />
          Your time. Your convenience.
        </motion.p>

        <motion.h1 variants={springItem as Variants} className="hero-text ">
          Skip the wait.
          <span className="mt-2 block font-custom text-3xl font-semibold tracking-tight text-[#514A3D] sm:text-4xl md:text-5xl lg:text-6xl">
            Find services near you.
          </span>
        </motion.h1>

        <motion.p
          variants={springItem as Variants}
          className="p-text text-center"
        >
          Discover trusted local services, book appointments, skip long queues,
          and track your service requests in real time. With Suvidha, manage
          your everyday services easily and spend less time waiting.
        </motion.p>

        <motion.div
          variants={springItem as Variants}
          className="mt-2 flex sm:flex-row flex-col justify-center gap-3 sm:gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            onClick={handleExploreServices}
            type="button"
            disabled={status === "loading"}
            className="group btn text-white bg-[#B11226] hover:bg-[#921020] gap-2 disabled:opacity-50"
          >
            Explore services
            <MoveRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            onClick={handleBusinessClick}
            type="button"
            disabled={status === "loading"}
            className="btn hover:bg-[#EDE0BE] disabled:opacity-50"
          >
            {status === "loading" ? "Loading..." : buttonText}
          </motion.button>
        </motion.div>

        <motion.p
          variants={springItem as Variants}
          className="mt-4 text-center text-xs font-medium tracking-wide text-black/50 sm:mt-6 sm:text-sm"
        >
          Salons <span className="px-1.5 text-[#B11226]">·</span>
          Clinics <span className="px-1.5 text-[#B11226]">·</span>
          Repair Shops <span className="px-1.5 text-[#B11226]">·</span>
          Local Services
        </motion.p>
      </motion.div>
    </section>
  );
}
