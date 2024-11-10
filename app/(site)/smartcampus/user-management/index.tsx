"use client"
import UserManagement from "@/components/user-management";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import LoadingLayout from "@/components/Layouts/LoadingLayout";
export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "student" || user?.role === "lecturer" || user?.role === "classsrep" || user?.role === "Student" || user?.role === "Lecturer" || user?.role === "Classsrep" ) {
    router.push("/smartcampus/dashboard"); 
    return null; 
  }

  return (
    <LoadingLayout>
      <UserManagement />
    </LoadingLayout>
  );
}
