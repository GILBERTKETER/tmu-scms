import { Metadata } from "next";
import CalendarApp from "./index";

export const metadata: Metadata = {
  title: "Academic Calendar - Smart Campus",
  description: "View important academic calendar events, including class schedules, exams, holidays, and campus activities.",
};


export default function Calendar() {
  return (
    <CalendarApp />
  );
}