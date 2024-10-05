import { Metadata } from "next";
import Map from "@/components/campusMap/index";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description:
    "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};

export default function CampusMap() {
  return (
    <>
      <Map />
    </>
  );
}
