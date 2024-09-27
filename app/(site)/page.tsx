import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Testimonial from "@/components/Testimonial";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata: Metadata = {
  title: "Compliance Is Us - Expert Solutions for Regulatory Compliance",
  description:
    "Your go-to source for comprehensive compliance services, including risk analysis, transaction monitoring, regulatory advisory, and more.",
};

export default function Home() {
  return (
    <main>
        <ToastContainer />
        <Hero />
        <Brands />
        <Feature />
        <About />
        <FeaturesTab />
        <FunFact />
        <Integration />
        <CTA />
        <FAQ />
        <Testimonial />
    </main>
  );
}
