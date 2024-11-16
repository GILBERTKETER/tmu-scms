"use client"
import React, {Suspense} from "react";
import ResetPassword from "@/components/Auth/reset-password";

import HomeLayout from "@/components/Layouts/homeLayout";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback="Please wait">
      <HomeLayout>
        <ResetPassword />
      </HomeLayout>
    </Suspense>
  );
};

export default ResetPasswordPage;
