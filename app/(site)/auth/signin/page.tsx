import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign In - Smart Campus",
  description:
    "Log in to your Smart Campus account to manage your courses, academic progress, and campus activities.",
};

import HomeLayout from "@/components/Layouts/homeLayout";

const SigninPage = () => {
  return (
    <>
      <HomeLayout>
        <Signin />
      </HomeLayout>
    </>
  );
};

export default SigninPage;
