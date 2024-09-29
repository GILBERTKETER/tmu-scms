import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Smart Campus",
  description:
    "Create a new Smart Campus account to start managing your academic life and access campus resources.",
};
import HomeLayout from "@/components/Layouts/homeLayout";

export default function Register() {
  return (
    <>
      <HomeLayout>
        <Signup />
      </HomeLayout>
    </>
  );
}
