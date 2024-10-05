import { Metadata } from "next";
import UserManagement from "@/components/user-management";
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description: "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};


export default function Management() {
  return (
    <>
      <UserManagement/>
    </>
  );
}
