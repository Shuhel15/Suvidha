import CategoriesSection from "@/components/landing/CategoriesSection";
import FAQSection from "@/components/landing/FAQSection";
import ForEveryone from "@/components/landing/ForEveryone";
import HeroSection from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import LocalDiscovery from "@/components/landing/LocalDiscovery";
import WhySuvidha from "@/components/landing/WhySuvidha";

export default function LandingPage() {
  return (
    <>
    <HeroSection/>
    <CategoriesSection/>
    <WhySuvidha/>
    <HowItWorks/>
    <ForEveryone/>
    <LocalDiscovery/>
    <FAQSection/>
    </>
  );
}