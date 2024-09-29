import ForgotPassword from "@/components/Auth/forgotpassword";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forgot Password - Smart Campus",
  description:
    "Easily reset your Smart Campus account password. Stay connected with your courses and campus resources.",
};
import HomeLayout from "@/components/Layouts/homeLayout";

const ForgotPasswordPage = () => {
  return (
    <>
      <HomeLayout>
        <ForgotPassword />
      </HomeLayout>
    </>
  );
};

export default ForgotPasswordPage;
