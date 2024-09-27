import ResetPassword from "@/components/Auth/reset-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Compliance Is Us",
  description: "Securely access your Compliance Is Us account. Log in to manage your compliance processes and stay updated with our latest features.",
};


const ResetPasswordPage = () => {
  return (
    <>
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
