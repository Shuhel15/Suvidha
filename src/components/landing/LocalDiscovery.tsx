"use client";
import { motion, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";
import {
  ArrowUpRight,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LocalDiscovery() {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="section"
    >
      <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
        <div
        className="flex flex-col items-center sm:items-start"
        >
          <motion.p 
          variants={springItem as Variants}
          className="text-xs font-bold uppercase tracking-[0.25em] text-[#B11226] mb-4 items-center ">
            Local by nature
          </motion.p>

          <motion.h2
            variants={springItem as Variants}
            className="h2-text items-start"
          >
            Good services might be{" "}
            <span className="text-black">closer than you think.</span>
          </motion.h2>

          <motion.p
            variants={springItem as Variants}
            className="p-text items-start mt-4 "
          >
            Finding a local service shouldn&apos;t mean endless searching.
            Suvidha brings the discovery experience closer to your
            neighbourhood, so you can spend more time on what matters.
          </motion.p>

          <motion.button
            variants={springItem as Variants}
            type="button"
            onClick={() => router.push("services")}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#B11226] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#821422] active:scale-95 "
          >
            Eplore local services
            <ArrowUpRight
              size={18}
              className="group-hover:-translate-y-1 group-hover:translate-x-1 duration-200 transition-transform"
            />
          </motion.button>

          <motion.div
            variants={springItem as Variants}
            className="mt-8 flex items-center gap-2 text-xs font-medium text-black/55"
          >
            <ShieldCheck size={17} className="text-[#B11226]" />
            <span>Choose your area. Discover at your pace.</span>
          </motion.div>
        </div>

        <motion.div
         className="flex-col flex gap-6">
          <motion.div
          variants={springItem as Variants}
          whileHover={{scale:1.05}}
           className="group flex flex-row items-center gap-4 bg-[#F9F6EE] p-4 rounded-2xl shadow-md shadow-black/10">
            <div className="h-fit p-4 w-fit rounded-2xl bg-[#B11226]/20 text-[#B11226] group-hover:bg-[#B11226]/30 duration-200">
              <MapPin size={24} className="transition-transform group-hover:-translate-y-1 duration-200" />
            </div>
            <div >
              <h3 className="font-bold text-black text-lg">
                Close to your neighbourhood
              </h3>
              <p className="text-black/50">
                Explore local service options near your location.
              </p>
            </div>
          </motion.div>

          <motion.div
          variants={springItem as Variants}
          whileHover={{scale:1.05}}
           className="group flex flex-row items-center gap-4 bg-[#F9F6EE] p-4 rounded-2xl shadow-md shadow-black/10">
            <div className="h-fit p-4 w-fit rounded-2xl bg-[#B11226]/20 text-[#B11226] group-hover:bg-[#B11226]/30 duration-200">
              <Search size={24} className="transition-transform group-hover:rotate-45 duration-200" />
            </div>
            <div>
              <h3 className="font-bold text-black text-lg">
                The right service, easy to find
              </h3>
              <p className="text-black/50">
                From a fresh haircut to a phone repair, start with whar you
                need.
              </p>
            </div>
          </motion.div>

          <motion.div
          variants={springItem as Variants}
          whileHover={{scale:1.05}}
           className="group flex flex-row items-center gap-4 bg-[#F9F6EE] p-4 rounded-2xl shadow-md shadow-black/10">
            <div className="h-fit p-4 w-fit rounded-2xl bg-[#B11226]/20 text-[#B11226] group-hover:bg-[#B11226]/30 duration-200">
              <Navigation size={24} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-200" />
            </div>
            <div>
              <h3 className="font-bold text-black text-lg">
                Your location, your choice{" "}
              </h3>
              <p className="text-black/50  ">
                Use your location when available, or choose where you want to
                search
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
