"use client";
import Bookings from "@/components/HallBooking";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import LoadingLayout from "@/components/Layouts/LoadingLayout";
export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "student") {
    router.push("/smartcampus/dashboard");
    return null;
  }

  return (
    <LoadingLayout>
      <Bookings />
    </LoadingLayout>
  );
}
