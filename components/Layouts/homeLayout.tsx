"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import ToasterContext from "@/app/context/ToastContext";
import LoadingLayout from "./LoadingLayout"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadingLayout>
      <Lines />
      <Header />
      <ToasterContext />
      {children}
      <Footer />
      <ScrollToTop />
    </LoadingLayout>
  );
}