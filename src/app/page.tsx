import type { Metadata } from "next";
import LandingPage from "@/components/landing/Landing";

export const metadata: Metadata = {
  title:"Home | Suvidha",
  description:
    "Discover trusted local services, book appointments, skip long queues, and track your service requests in real time. With Suvidha, manage your everyday services easily and spend less time waiting.",

    alternates: {
      canonical: "/",
    },
  robots:{
    index: true,
    follow: true,
  }
}

export default function Home() {
  return (
    <LandingPage/>
  )
}