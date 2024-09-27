import ForgotPassword from "@/components/Auth/forgotpassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Compliance Is Us",
  description: "Securely access your Compliance Is Us account. Log in to manage your compliance processes and stay updated with our latest features.",
};


const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
