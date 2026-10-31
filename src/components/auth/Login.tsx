"use client";

import { ChartSpline, Clock, LogIn, MapPin } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  return (
    <section className="section">
      <div className="flex flex-row">
        <div className="hidden md:block border-t-2 border-l-2 border-b-2 border-black/50 p-10 space-y-5 rounded-lg shadow-2xl">
          <h1 className="flex items-center gap-0.5 text-2xl font-bold text-black/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#B11226] font-black text-black">
              S
            </span>
            uvidha
          </h1>
          <p className="eye uppercase mt-5"> Your time. Your convenience.</p>
          <h2 className="h2-text w-xl text-5xl">
            Life gets busy. Your services shouldn&apos;t make it busier.
          </h2>
          <p className="p-text w-xl">
            From finding a nearby salon to tracking a repair, Suvidha brings
            everyday local services closer to you.
          </p>
          <div className="group text-xl flex flex-row gap-2 items-center font-semibold">
            <div className="p-2 rounded-full shadow-inner shadow-black/10">
              <MapPin
                size={22}
                className="transition-transform group-hover:-translate-y-1 duration-200 text-[#B11226]"
              />
            </div>
            Discover local services
          </div>
          <div className="group text-xl flex flex-row gap-2 items-center font-semibold">
            <div className="p-2 rounded-full shadow-inner shadow-black/10">
              <Clock
                size={22}
                className="transition-transform group-hover:rotate-180 duration-200 text-[#B11226]"
              />
            </div>
            Make better use of your time
          </div>
          <div className="group text-xl flex flex-row gap-2 items-center font-semibold">
            <div className="p-2 rounded-full shadow-inner shadow-black/10">
              <ChartSpline
                size={22}
                className="transition-transform group-hover:-translate-y-1 duration-200 text-[#B11226]"
              />
            </div>
            Stay updated on your services
          </div>
        </div>

        <div className="flex flex-col border-t-2 border-l-2 border-r-2 border-b-2 border-black/50 p-10 space-y-5 rounded-lg shadow-2xl">
          <h1 className="md:hidden sm:block  items-center gap-0.5 text-2xl font-bold text-black/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#B11226] font-black text-black">
              S
            </span>
            uvidha
          </h1>
          <h2 className="h2-text w-xl text-5xl flex  justify-center text-center whitespace-nowrap">
            {" "}
            Welcome back!
          </h2>
          <form className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
            <label
              htmlFor="email"
              className="uppercase tracking-[0.10rem] font-semibold text-black/50"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Aapka gmail"
              className="shadow-inner w-md shadow-black/10 rounded-2xl py-2 px-3 bg-white/70 "
            />
            </div>
            <div className="flex flex-col gap-4">
            <label
              htmlFor="password"
              className="uppercase tracking-[0.10rem] font-semibold text-black/50"
            >
              Password
            </label>
            <input
              type="password"
              className="shadow-inner shadow-black/10 w-md rounded-2xl py-2 px-3 bg-white/70 focus:border-none"
              placeholder="Aapka Password"
            />
            </div>
            <Link
            href=""
            className="text-[#B11226] hover:underline hover:duration-200"
            >Forgot Password ? </Link>
            <div className="flex justify-center ">

            
            <button
            className="group flex w-md flex-row gap-2 justify-center items-center text-center text-white font-semibold text-lg bg-[#B11226] shadow-inner shadow-black/20 px-4 py-2 rounded-full active:scale-95 duration-200 ease-in-out"
            >
             <LogIn className="transition-transform group-hover:translate-x-1 duration-200" size={17} /> Login 
            </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
