import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import DottedWaves from "@/components/styling/DottedWaves";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const myFont = localFont({
  src: "./fonts/EduQLDHand-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-my-font",
});

const outfit = Outfit({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suvidha.vercel.app"),

  title: {
    default: "Suvidha | Service Management Made Easy",
    template: "%s | Suvidha",
  },

  description:
    "Discover trusted local services, book appointments, skip long queues, and track your service requests in real time. Manage everyday services easily with Suvidha.",

  keywords: [
    "Suvidha",
    "local service booking",
    "online appointment booking",
    "service management platform",
    "service request tracking",
    "trusted local services",
  ],

  authors: [
    {
      name: "Shuhel Ahmed",
    },
  ],

  creator: "Shuhel Ahmed",

  openGraph: {
    title: "Suvidha | Service Management Made Easy",
    description:
      "Discover trusted local services, book appointments, and track your service requests with Suvidha.",
    url: "/",
    siteName: "Suvidha",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suvidha - Service Management Made Easy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Suvidha | Service Management Made Easy",
    description:
      "Discover trusted local services, book appointments, and track your service requests with Suvidha.",
    images: [
      {
        url: "/og-image.png",
        alt: "Suvidha - Service Management Made Easy",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${myFont.variable} ${outfit.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#F5EBD0]">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#EDE0BE",
              color: "#000000",
              border: "1px solid #B11226",
            },
            duration: 4000,
          }}
        />
        <Providers>
          <DottedWaves />
          <Container>
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
          </Container>
        </Providers>
      </body>
    </html>
  );
}
