"use client";
import Link from "next/link";
import { Scissors, Stethoscope, Smartphone, ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";

const categories = [
  {
    icon: Scissors,
    number: "01",
    title: "Salon & Barbershop",
    description:
      "Your fresh look shouldn't come with a long wait. Find your barber, plan your visit, and make every minute count.",
    label: "Look sharp. Wait less.",
    href: "/services?category=salon",
  },
  {
    icon: Stethoscope,
    number: "02",
    title: "Clinics & Doctors",
    description:
      "Your health deserves your attention, not hours in a waiting room. Discover healthcare services and make visits easier.",
    label: "Care without the chaos.",
    href: "/services?category=clinic",
  },
  {
    icon: Smartphone,
    number: "03",
    title: "Mobile Repair",
    description:
      "Cracked screen? Phone acting up? Find repair services and keep track of your device's journey back to you.",
    label: "Fix it. Track it. Get it back.",
    href: "/services?category=mobile-repair",
  },
];

export default function CategoriesSection() {
  return (
    <section id="about" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div
          variants={springItem as Variants}
          className="mb-12 flex flex-col gap-4 sm:mb-16"
        >
          <motion.p variants={springItem as Variants} className="mb-5 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]">
            Everyday needs, made easier
          </motion.p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="h2-text ">
              Less waiting around.
              <span className="text-[#B11226]"> More living.</span>
            </h2>

            <p className="p-text ">
              From a quick trim to a doctor visit or a phone repair, life&apos;s
              little errands should never take over your day.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 md:grid-cols-3 "
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.number}
                variants={springItem as Variants}
                whileHover={{scale:1.03}}
              >
                <Link
                  key={category.number}
                  href={category.href}
                  className="group flex h-90 flex-col rounded-2xl border border-neutral-200 bg-white/25 backdrop-blur-2xl p-6 transition-all duration-300 hover:border-[#B11226]/30 hover:shadow-xl hover:shadow-[#B11226]/5 sm:p-8"
                >
                  <div className="mb-8 group flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EBD0] text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-7xl font-black text-neutral-300 group-hover:text-[#B11226] transition-colors duration-200">
                      {category.number}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-black">
                    {category.title}
                  </h3>

                  <p className="text-black/50 text-lg py-1">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-5">
                    <span className="text-sm font-semibold text-[#B11226]">
                      {category.label}
                    </span>

                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-[#B11226] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
