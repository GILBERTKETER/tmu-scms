"use client"
import Facilities from "@/components/Facilities";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "student") {
    router.push("/smartcampus/dashboard"); 
    return null; 
  }

  return (
    <>
      <Facilities />
    </>
  );
}
