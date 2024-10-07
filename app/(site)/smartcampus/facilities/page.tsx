import { Metadata } from "next";
import Facilities from "@/components/Facilities";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description: "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};


export default function FacilitiesPage() {
  return (
    <>
      <Facilities/>
    </>
  );
}
