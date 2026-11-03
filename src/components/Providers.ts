"use client";

import { SessionProvider } from "next-auth/react";
import { createElement, type ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return createElement(SessionProvider, null, children);
}
