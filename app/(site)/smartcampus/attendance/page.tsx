import { Metadata } from "next";
import Attendance from "@/components/Attendance";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description: "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};


export default function AttendancePage() {
  return (
    <>
      <Attendance/>
    </>
  );
}
