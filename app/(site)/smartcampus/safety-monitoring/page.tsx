import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SafetyMonitoring from "@/components/safetyMonitoring"
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description: "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};


export default function SaafetyMonitoring() {
  return (
    <>
      <SafetyMonitoring/>
    </>
  );
}
