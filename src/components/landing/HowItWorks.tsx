"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,

  type Variants
} from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";

import { useRef } from "react";
import {
  Search,
  CalendarCheck,
  Activity,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    label: "DISCOVER",
    title: "Start with what you need.",
    description:
      "A fresh haircut, a doctor who can help, or a phone that needs fixing. Find the right local service without the endless searching.",
    note: "Your needs. Your neighbourhood.",
    icon: Search,
    side: "right",
  },
  {
    number: "02",
    label: "CHOOSE YOUR SERVICE",
    title: "Find the right fit for you.",
    description:
      "Explore nearby businesses, compare the services they offer, and choose the one that works for your needs and location.",
    note: "The right service, closer to you.",
    icon: MapPin,
    side: "left",
  },
  {
    number: "03",
    label: "GET STARTED",
    title: "Make your next move.",
    description:
      "Join a salon queue, arrange a clinic appointment, or submit a mobile repair request. Get started in a way that fits the service you need.",
    note: "Less uncertainty. More control.",
    icon: CalendarCheck,
    side: "right",
  },
  {
    number: "04",
    label: "STAY IN THE KNOW",
    title: "Know where things stand.",
    description:
      "Keep track of your queue position, appointment progress, or repair status. No need to keep wondering what happens next.",
    note: "Stay informed. Plan ahead.",
    icon: Activity,
    side: "left",
  },
  {
    number: "05",
    label: "MOVE FORWARD",
    title: "Get on with what matters.",
    description:
      "Know when your turn approaches, keep up with your appointment, or see when your device is ready for pickup. Make your day easier to plan.",
    note: "Your time. Your convenience.",
    icon: CheckCircle2,
    side: "right",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 65%", "end 75%"],
  });

  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="section w-full overflow-x-clip">
      <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{once:true, amount:0.2}}
      variants={staggerContainer}
      >
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-24">
          <motion.p
          variants={springItem as Variants}
          className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]">
            Simple by design
          </motion.p>

          <motion.h2
          variants={springItem as Variants}
          className="h2-text text-center ">
            Five steps.
            <span className="text-[#B11226]"> A better day.</span>
          </motion.h2>

          <motion.p
          variants={springItem as Variants}
          className= " mt-4 p-text text-center ">
            No complicated process. No unnecessary back-and-forth. Just a
            simpler way to handle the everyday services that keep your life
            moving.
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-2.75 top-0 w-px bg-neutral-200 md:left-1/2 md:-translate-x-1/2" />

          <motion.div
            style={{ scaleY: lineProgress }}
            className="absolute bottom-0 left-2.75 top-0 w-px origin-top bg-[#B11226] md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-12 sm:gap-16 md:gap-24">
            {steps.map((step) => {
              const Icon = step.icon;
              const isLeft = step.side === "left";

              return (
                <div
                  key={step.number}
                  className="relative grid grid-cols-[24px_minmax(0,1fr)] items-center gap-x-5 md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:gap-x-6"
                >
                  <div className="z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
                    <motion.div
                      initial={
                        shouldReduceMotion ? false : { scale: 0.6, opacity: 0 }
                      }
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.45,
                        delay: shouldReduceMotion ? 0 : 0.1,
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-[5px] border-white bg-[#B11226] shadow-[0_0_0_1px_#B11226]"
                    />
                  </div>

                  <motion.article
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: isLeft ? -30 : 30,
                          }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                    }}
                    className={`group relative col-start-2 row-start-1 min-w-0 rounded-2xl border border-neutral-200 bg-white/25 p-6 backdrop-blur-2xl transition-colors duration-300 hover:border-[#B11226]/40 sm:p-8 ${
                      isLeft
                        ? "md:col-start-1 md:col-end-2 md:text-right"
                        : "md:col-start-3 md:col-end-4 md:text-left"
                    }`}
                  >
                    <div
                      className={`mb-6 flex items-center justify-between gap-4 ${
                        isLeft ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B11226] text-white transition-transform duration-300 group-hover:scale-110">
                        <Icon size={23} strokeWidth={1.8} />
                      </div>

                      <span className="text-7xl font-black tracking-tighter text-neutral-200 transition-colors duration-300 group-hover:text-[#B11226] sm:text-6xl">
                        {step.number}
                      </span>
                    </div>

                    <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#B11226]">
                      {step.label}
                    </p>

                    <h3 className="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                      {step.description}
                    </p>

                    <div
                      className={`mt-6 flex items-center gap-2 text-sm font-semibold text-[#B11226] ${
                        isLeft ? "md:justify-end" : "justify-start"
                      }`}
                    >
                      <span>{step.note}</span>
                      <ArrowUpRight
                        size={17}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
        variants={springItem as Variants}
          className=" mt-20 flex flex-col items-center text-center sm:mt-28"
        >
          <p className="text-2xl font-extrabold leading-snug text-neutral-900 sm:text-3xl">
            That&apos;s it. More clarity,{" "}
            <span className="text-[#B11226]">less waiting around.</span>
          </p>

          <p className="p-text mt-4 text-center">Everyday services, made a little more human.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
