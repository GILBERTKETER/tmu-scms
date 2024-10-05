import { Metadata } from "next";
import CourseManagement from "@/components/CourseManagement/index";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description:
    "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};

export default function Courses() {
  return (
    <>
      <CourseManagement />
    </>
  );
}
