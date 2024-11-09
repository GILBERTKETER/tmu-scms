import { Metadata } from "next";
import UserManagement from "./index";
export const metadata: Metadata = {
  title: "User Management - Smart Campus",
  description:
    "Manage users, roles, and permissions within the Smart Campus system. Easily add, update, and remove users to ensure smooth campus operations.",
};



export default function Management() {
  return (
    <>
      <UserManagement/>
    </>
  );
}
