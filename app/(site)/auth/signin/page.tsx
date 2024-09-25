import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Compliance Is Us",
  description: "Securely access your Compliance Is Us account. Log in to manage your compliance processes and stay updated with our latest features.",
  // other metadata
};


const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
