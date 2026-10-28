
"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { staggerContainer, springItem } from "../layout/animation";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const faqs = [
  {
    category: "FOR CUSTOMERS",
    question: "What is Suvidha?",
    answer:
      "Suvidha is designed to help you discover local services and make everyday visits easier to manage, from salon queues to clinic visits and mobile repairs.",
  },
  {
    category: "FOR CUSTOMERS",
    question: "How can I find services near me?",
    answer:
      "You will be able to explore services using your location or by choosing an area manually. You can start from the Explore Services page.",
  },
  {
    category: "FOR CUSTOMERS",
    question: "Can I track my queue or repair status?",
    answer:
      "Suvidha is being designed to support queue-position updates and repair-status tracking. Availability will depend on the business and the features implemented on the platform.",
  },
  {
    category: "FOR CUSTOMERS",
    question: "Do I need to use my current location?",
    answer:
      "No. The planned discovery experience will also support manually choosing a location, so you can search in an area that suits you.",
  },
  {
    category: "FOR BUSINESS OWNERS",
    question: "Can I list my business on Suvidha?",
    answer:
      "Suvidha is being built to help local service providers present their businesses and organise service workflows. Business registration will be available once that functionality is implemented.",
  },
  {
    category: "FOR BUSINESS OWNERS",
    question: "Which types of businesses is Suvidha for?",
    answer:
      "The initial focus is on salons and barbershops and repair shops. The platform is designed around the different workflows these services need.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const router = useRouter();

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section flex flex-col items-center justify-center"
    >
      <div>
        {/* Section heading */}
        <motion.div
          variants={staggerContainer}
          className="mb-12 flex flex-col items-center text-center md:mb-16"
        >
          <motion.p
            variants={springItem as Variants}
            className="mb-4 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B11226]"
          >
            <MessageCircle size={16} />
            Got questions
          </motion.p>

          <motion.h2 variants={springItem as Variants} className="h2-text mt-5 text-center">
            A few things you might
            <span className="text-black"> want to know.</span>
          </motion.h2>

          <motion.p
            variants={springItem as Variants}
            className="p-text mt-4 text-center"
          >
            Here are some answers about Suvidha, how it is designed to work, and
            what it aims to make easier.
          </motion.p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          variants={staggerContainer}
          className="mx-auto max-w-3xl"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                variants={springItem as Variants}
                className="border-b border-black/10"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 py-6 text-left"
                >
                  <span className="flex-1">
                    <span className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-[#B11226]/75">
                      {faq.category}
                    </span>

                    <span className="text-base font-semibold leading-6 text-black transition-colors duration-200 hover:text-[#B11226] sm:text-lg">
                      {faq.question}
                    </span>
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isOpen
                        ? "border-[#B11226] bg-[#B11226] text-white"
                        : "border-black/10 bg-white text-black/70"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      variants={springItem as Variants}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-black/60 sm:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={springItem as Variants}
          className="mx-auto mt-12 flex max-w-3xl flex-col items-start justify-between gap-5 rounded-2xl bg-[#F5EBD0] p-6 sm:flex-row sm:items-center sm:p-8"
        >
          <div>
            <h3 className="text-lg font-bold text-black sm:text-xl">
              Still curious about Suvidha?
            </h3>

            <p className="mt-2 text-sm leading-6 text-black/60">
              Take a look at the services we are building for you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/services")}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#B11226] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#821422] active:scale-95"
          >
            Explore services
            <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-200" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
