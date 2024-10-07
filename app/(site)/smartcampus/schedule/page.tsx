import { Metadata } from "next";
import Scheduler from "@/components/Schedule";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description:
    "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};

export default function ClassSchedule() {
  return (
    <>
      <Scheduler />
    </>
  );
}
