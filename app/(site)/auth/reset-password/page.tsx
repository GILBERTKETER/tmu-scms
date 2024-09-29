import ResetPassword from "@/components/Auth/reset-password";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reset Password - Smart Campus",
  description:
    "Create a new password for your Smart Campus account and regain access to your academic dashboard and university services.",
};

import HomeLayout from "@/components/Layouts/homeLayout";

const ResetPasswordPage = () => {
  return (
    <>
      <HomeLayout>
        <ResetPassword />
      </HomeLayout>
    </>
  );
};

export default ResetPasswordPage;
