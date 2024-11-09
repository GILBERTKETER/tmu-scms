import { Metadata } from "next";
import CourseManagement from "./index";
export const metadata: Metadata = {
  title: "Course Management - Smart Campus",
  description:
    "Manage your courses efficiently. Add, update, and organize your courses and assignments, all in one place.",
};


export default function Courses() {
  return (
    <>
      <CourseManagement />
    </>
  );
}
