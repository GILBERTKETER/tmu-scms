import { Metadata } from "next";
import Attendance from "./index"
export const metadata: Metadata = {
  title: "Attendance - Smart Campus",
  description: "Track your attendance and manage your class participation.",
};

export default function AttendancePage() {
  return (
    <>
      <Attendance />
    </>
  );
}
