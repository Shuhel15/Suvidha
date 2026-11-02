"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, navbarDrop } from "./animation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#how-it-works", label: "How It works" },
    { href: "/services", label: "Services" },
  ];

  const mobileMenuContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const mobileMenuItem = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
      },
    },
  };
  return (
    <motion.nav
      variants={navbarDrop}
      initial="hidden"
      animate="show"
      className="fixed top-3 left-0 right-0 z-50 mx-auto flex h-14 w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-xl border border-[#B11226]/20 bg-[#F5EBD0]/30 px-4 backdrop-blur-md shadow-xl shadow-black/10 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]"

    >
      <motion.h1
        variants={fadeInUp}
        className="flex items-center gap-0.5 text-2xl font-bold text-black/60"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#B11226] font-black text-white">
          S
        </span>
        uvidha<span className="text-[#B11226]">.</span>
      </motion.h1>

      <motion.div
        variants={staggerContainer}
        className="hidden md:flex items-center gap-4"
      >
        {navLinks.map((link) => (
          <motion.div key={link.href} variants={fadeInUp}>
            <Link
              href={link.href}
              className={`text-black/50 font-semibold px-2 py-0.5 rounded-lg ${
                pathname === link.href
                  ? "shadow-inner shadow-black/10 bg-[#EDE0BE]"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp} className="hidden md:block">
        <Link
          href="/login"
          className="group flex items-center justify-center gap-1 bg-[#B11226] font-semibold text-white/80 hover:text-[#B11226] transition-all duration-200 ease-in-out hover:bg-[#eddcae] hover:scale-105 px-2 py-1 rounded-lg shadow-inner shadow-black/10"
        >
          Login
          <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
        </Link>
      </motion.div>

      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group md:hidden shadow-inner p-2 rounded-lg shadow-black/10"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Menu className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        )}
      </button>

      {/* Mobile dropdown */}
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : 30,
          scale: isOpen ? 1 : 0.98,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        style={{
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="absolute right-0 top-full mt-2 z-60 w-52 origin-top-right rounded-2xl border border-black/10 bg-[#F5EBD0] p-6 shadow-xl md:hidden"
      >
        <motion.nav
          variants={mobileMenuContainer}
          initial="hidden"
          animate={isOpen ? "show" : "hidden"}
          className="flex flex-col gap-5 text-center"
        >
          <motion.div
            className="flex flex-col justify-center items-center gap-4"
            variants={mobileMenuContainer}
          >
            {navLinks.map((link) => (
              <motion.div key={link.href} variants={mobileMenuItem}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-2 py-1 text-black/50 font-semibold hover:shadow-inner shadow-black/10 rounded-lg transition-all duration-200 hover:scale-105 active:scale-100 ${
                    pathname === link.href ? "shadow-inner bg-[#EDE0BE]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={mobileMenuItem}>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="group flex justify-center items-center gap-1 bg-[#B11226] font-semibold text-white/80 hover:text-[#B11226] transition-all duration-200 ease-in-out hover:bg-[#eddcae] hover:scale-105 px-2 py-1 rounded-lg shadow-inner shadow-black/10"
            >
              Login
              <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          </motion.div>
        </motion.nav>
      </motion.div>
    </motion.nav>
  );
}
