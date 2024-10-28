import { Metadata } from "next";
import CalenderComponent from "@/components/calender";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description: "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};


export default function Calender() {
  return (
    <>
     <CalenderComponent/>
    </>
  );
}
