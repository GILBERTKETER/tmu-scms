import ResetPassword from "./index";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reset Password - Smart Campus",
  description:
    "Create a new password for your Smart Campus account and regain access to your academic dashboard and university services.",
};


const ResetPasswordPage = () => {
  return (
    <>
     
        <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
