"use client";
import {
  Clock3,
  Activity,
  MapPinned,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";
import { easeInOut, motion, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";

const features = [
  {
    number: "01",
    icon: Clock3,
    title: "Your time belongs to you.",
    description:
      "Life is too short to spend it guessing how long you'll have to wait. Plan your visit and make room for the things that matter.",
  },
  {
    number: "02",
    icon: Activity,
    title: "Always know what's next.",
    description:
      "Keep track of your queue, appointment, or repair progress without repeatedly calling or wondering what is happening.",
  },
  {
    number: "03",
    icon: MapPinned,
    title: "Good services, closer to home.",
    description:
      "Discover useful local businesses around your area and bring everyday essentials a little closer to you.",
  },
  {
    number: "04",
    icon: Smartphone,
    title: "Less chasing. More clarity.",
    description:
      "From finding a service to following its progress, get a clearer experience without unnecessary back-and-forth.",
  },
];

export default function WhySuvidha() {
  return (
    <section className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        
      >
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="flex flex-col items-center">
            <motion.span
              variants={springItem as Variants}
              className="mb-5 text-center inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B11226]"
            >
              
              The Suvidha difference
            </motion.span>

            <motion.h2 variants={springItem as Variants} className="h2-text py-2.5">
              Your day has
              <span className="text-black"> better things </span>
              to do.
            </motion.h2>

            <motion.p
              variants={springItem as Variants}
              className="p-text py-2.5"
            >
              A haircut shouldn&apos;t take half your day. A doctor visit
              shouldn&apos;t mean endless uncertainty. And a phone repair
              shouldn&apos;t leave you wondering.
            </motion.p>

            <motion.p
              variants={springItem as Variants}
              className="mt-4 max-w-lg text-base text-center sm:text-start leading-8 text-neutral-600"
            >
              Suvidha brings everyday services into a clearer, more convenient
              experience — so you can spend less time waiting and more time
              living.
            </motion.p>

            <motion.div
              variants={springItem as Variants}
              className="group mt-9 flex items-center gap-3 border-b-2 border-[#B11226] pb-2 text-sm font-bold text-[#B11226]"
            >
              Convenience is not a luxury. It&apos;s the point.
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 duration-200"
              />
            </motion.div>
          </div>

          <motion.div
            variants={staggerContainer}
            className="divide-y divide-neutral-200"
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  variants={springItem as Variants}
                  whileHover={{ scale: 1.03 }}
                  transition={{ ease: easeInOut }}
                  key={feature.number}
                  className="group grid grid-cols-[42px_1fr] gap-4 py-7 first:pt-0 sm:grid-cols-[52px_1fr] sm:gap-5 hover:shadow-2xl shadow-black/10 rounded-xl px-2  duration-200 "
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#B11226] transition-all duration-300 group-hover:border-[#B11226] group-hover:bg-[#B11226] group-hover:text-white sm:h-12 sm:w-12">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold tracking-widest text-neutral-400">
                        {feature.number}
                      </span>

                      <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
                        {feature.title}
                      </h3>
                    </div>

                    <p className="max-w-lg text-sm leading-7 text-neutral-600 sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          variants={springItem as Variants}
          className="mt-16 flex flex-col justify-between gap-5 rounded-2xl bg-[#B11226] p-7 text-white sm:mt-20 sm:flex-row sm:items-center sm:p-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              A little more ease, every day
            </p>

            <h3 className="mt-3 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
              Your time is valuable. Let&apos;s treat it that way.
            </h3>
          </div>

          <span className="w-fit shrink-0 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold">
            That&apos;s Suvidha.
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
