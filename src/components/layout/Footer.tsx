"use client";

import { motion, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";
import { ArrowUpRight, Mail, MapPin, Clock3 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import Link from "next/link";

const footerLinks = {
  explore: [
    { label: "Home", href: "/" },
    { label: "Explore Services", href: "/services" },
    { label: "Categories", href: "/services" },
  ],
  services: [
    { label: "Salon & Barbershop", href: "/services?category=salon" },
    { label: "Clinics & Doctors", href: "/services?category=clinic" },
    {
      label: "Mobile Repair",
      href: "/services?category=mobile-repair",
    },
  ],
  company: [
    { label: "About Suvidha", href: "/#about" },
    { label: "Contact", href: "mailto:hello@suvidha.in" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-20">
      <div className="section mt-1 mb-1">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:py-20"
        >
          {/* Brand */}
          <motion.div
            variants={springItem as Variants}
            className="sm:col-span-2 lg:col-span-2"
          >
            <Link
              href="/"
              aria-label="Suvidha home"
              className="inline-flex items-center gap-1.5"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#B11226] text-lg font-black">
                S
              </span>

              <span className="text-2xl font-bold tracking-tight text-black/60">
                uvidha
              </span>
            </Link>

            <p className="font-custom mt-5 max-w-sm text-sm leading-7 text-black/60">
              Your time matters. Discover local services and move through
              everyday tasks with greater clarity and convenience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:hello@suvidha.in"
                aria-label="Email Suvidha"
                className="flex size-10 items-center justify-center rounded-full border border-black/10 text-black/60 transition-all duration-200 hover:border-[#B11226] hover:bg-[#B11226] hover:text-white"
              >
                <Mail size={17} />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex size-10 items-center justify-center rounded-full border border-black/10 text-black/60 transition-all duration-200 hover:border-[#B11226] hover:bg-[#B11226] hover:text-white"
              >
                <FaGithub size={17} />
              </a>
            </div>
          </motion.div>

          {/* Explore */}
          <motion.div variants={springItem as Variants}>
            <h3 className="text-sm font-bold text-black">Explore</h3>

            <ul className="mt-5 space-y-4">
              {footerLinks.explore.map((link) => (
                <li
                  key={link.label}
                  className="transition-transform duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 transition-colors hover:text-[#B11226]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={springItem as Variants}>
            <h3 className="text-sm font-bold text-black">Services</h3>

            <ul className="mt-5 space-y-4">
              {footerLinks.services.map((link) => (
                <li
                  key={link.label}
                  className="transition-transform duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 transition-colors hover:text-[#B11226]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={springItem as Variants}>
            <h3 className="text-sm font-bold text-black">Suvidha</h3>

            <ul className="mt-5 space-y-4">
              {footerLinks.company.map((link) => (
                <li
                  key={link.label}
                  className="transition-transform duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 transition-colors hover:text-[#B11226]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3 text-xs leading-5 text-black/50">
              <p className="flex items-start gap-2">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-[#B11226]"
                />
                Local services, closer to you.
              </p>

              <p className="flex items-start gap-2">
                <Clock3
                  size={15}
                  className="mt-0.5 shrink-0 text-[#B11226]"
                />
                Your time. Your convenience.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-black/10 py-6 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Suvidha. All rights reserved.</p>

          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[#B11226]"
          >
            Made for everyday convenience

            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}