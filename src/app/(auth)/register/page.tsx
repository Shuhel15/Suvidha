import RegistrationForm from "@/components/auth/Registration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Register",
  description:
    "Create a Suvidha account to access trusted local services, book appointments, skip long queues, and track your service requests in real time. Manage your everyday services easily and spend less time waiting.",

    alternates: {
      canonical: "/register",
    },

    robots:{
      index: false,
      follow: false,
    }
}

export default function RegistrationPage() {
  return (
    <main>
      <RegistrationForm />
    </main>
  );
}
