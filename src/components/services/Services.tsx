"use client";

import { Handshake } from "lucide-react";
import SearchBar from "../landing/SearchBar";
import { motion, type Variants } from "framer-motion";
import { springItem, staggerContainer } from "@/components/layout/animation";

export default function ServicesComp() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section"
    >
      <motion.p variants={springItem as Variants} className="eye">
        <Handshake className="icons" />
        Near by Services
      </motion.p>

      <motion.h1 variants={springItem as Variants} className="hero-text flex-row flex gap-2">
        Welcome, <span className="font-custom text-[#514A3D]">user</span>
      </motion.h1>

      <motion.p variants={springItem as Variants} className="p-text">
        You can search near by services here.
      </motion.p>
      <motion.div variants={springItem as Variants}>
        <SearchBar />
      </motion.div>
    </motion.section>
  );
}
