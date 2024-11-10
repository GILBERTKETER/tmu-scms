"use client";
import CourseManagement from "@/components/CourseManagement/index";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import LoadingLayout from "@/components/Layouts/LoadingLayout";
export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "admin") {
    router.push("/smartcampus/dashboard");
    return null;
  }

  return (
    <LoadingLayout>
      <CourseManagement />
    </LoadingLayout>
  );
}
