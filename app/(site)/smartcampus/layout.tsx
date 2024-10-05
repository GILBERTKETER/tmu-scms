"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ReactNode } from "react";
import "@arco-design/web-react/dist/css/arco.css";

import { ConfigProvider } from "@arco-design/web-react";
import enUS from "@arco-design/web-react/es/locale/en-US";
export default function SmartCampusLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConfigProvider locale={enUS}  theme={{
      primary: "#22409a", 
      secondary: "#fcb815", 
    }}>
      <DefaultLayout>{children}</DefaultLayout>
    </ConfigProvider>
  );
}
