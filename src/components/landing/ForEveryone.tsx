"use client";
import { motion, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Store,
  Users,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForEveryone() {
  const router = useRouter();
  return (
    <motion.section 
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.2}}
    variants={staggerContainer}
    className="section ">
      <motion.p
        variants={springItem as Variants}
        className=" text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]"
      >
        One platform. Two sides
      </motion.p>

      <motion.h2
        variants={springItem as Variants}
        className="h2-text text-center"
      >
        Made for the peope who{" "}
        <span className="text-black">provide and want</span> services.
      </motion.h2>

      <motion.p
        variants={springItem as Variants}
        className=" p-text text-center"
      >
        Whether you are looking for a reliable local service of running a
        business, Suvidha helps bring the experience together.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="grid md:grid-cols-2 gap-6 md:gap-8 mt-10"
      >
        <motion.div
          variants={springItem as Variants}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:p-10 border-[#B11226]/20 bg-[#B11226]/[0.035]"
        >
          <div className=" mb-8 flex items-center justify-between">
            <p className="uppercase font-bold text-xs text-black/50 tracking-[0.16em]">
              For customers
            </p>
            <p className="uppercase font-bold text-xs text-black/50 tracking-[0.16em]">
              01
            </p>
          </div>

          <h3 className="max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Your day, without the unnecessary waiting.
          </h3>

          <p className="mt-4 max-w-lg text-sm leading-7 text-black/60">
            Find local services, keep the track of your place in the queue,
            follow repair progress, and manage your visits with greater clarity.
          </p>

          <div className="my-8 h-px w-full bg-black/10" />

          <ul className="mb-10 space-y-5">
            <li className="flex items-center gap-3 text-sm font-medium text-black/75">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B11226]/10 text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                <MapPin size={18} />
              </span>
              Discover near businesses
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-black/75">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B11226]/10 text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                <Clock3 size={18} />
              </span>
              Spend less time guessing
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-black/75">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B11226]/10 text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                <Activity size={18} />
              </span>
              Stay updated on progress
            </li>
          </ul>
          <button
            type="button"
            onClick={() => router.push("/services")}
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#B11226] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#821422] active:scale-95"
          >
            Explore services
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>

        <motion.div
          variants={springItem as Variants}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:p-10 border-[#B11226]/20 bg-[#F9F6EE]"
        >
          <div className=" mb-8 flex items-center justify-between">
            <p className="uppercase font-bold text-xs text-black/50 tracking-[0.16em]">
              For business owners
            </p>
            <p className="uppercase font-bold text-xs text-black/50 tracking-[0.16em]">
              02
            </p>
          </div>

          <motion.h3 
          variants={springItem as Variants}
          className="max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Better organised. Easy to manage{" "}
          </motion.h3>

          <motion.p 
          variants={springItem as Variants}
          className="mt-4 max-w-lg text-sm leading-7 text-black/60">
            Bring your service into one place and work towards a smoother
            customer experience with organised queue, appointments, and repair
            updates.
          </motion.p>

          <div className="my-8 h-px w-full bg-black/10" />

          <ul className="mb-10 space-y-5">
            <li className="flex items-center gap-3 text-sm font-medium text-black/75">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B11226]/10 text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                <Store size={18} />
              </span>
              Show case your business{" "}
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-black/75">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B11226]/10 text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                <Users size={18} />
              </span>
              Organise customer workflows{" "}
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-black/75">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B11226]/10 text-[#B11226] transition-colors duration-300 group-hover:bg-[#B11226] group-hover:text-white">
                <Activity size={18} />
              </span>
              Manage service progress{" "}
            </li>
          </ul>
          <button
            type="button"
            onClick={() => router.push("/services")}
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#B11226] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#821422] active:scale-95"
          >
            Get started{" "}
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
