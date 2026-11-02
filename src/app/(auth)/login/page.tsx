import LoginForm from "@/components/auth/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Suvidha account.",

  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
