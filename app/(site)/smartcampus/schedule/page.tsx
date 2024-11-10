import { Metadata } from "next";
import Scheduler from "./index";
export const metadata: Metadata = {
  title: "Scheduling - Smart Campus",
  description:
    "Organize and manage your campus schedule, including classes, meetings, and events, all in one place.",
};

export default function ClassSchedule() {
  return <Scheduler />;
}
