import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Compliance Is Us",
  description: "Create your Compliance Is Us account to start managing your compliance processes and access all features tailored for your needs.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
