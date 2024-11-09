"use client"
import Attendance from "@/components/Attendance";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "admin") {
    router.push("/smartcampus/dashboard"); 
    return null; 
  }

  return (
    <>
      <Attendance />
    </>
  );
}
