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
  title: "Home - Smart Campus",
  description: "Welcome to Smart Campus, your centralized platform for managing courses, bookings, academic advising, and more.",
};

import HomeLayout from "@/components/Layouts/homeLayout"
export default function Home() {
  return (
    <main>
      <HomeLayout>
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
      </HomeLayout>
       
    </main>
  );
}
