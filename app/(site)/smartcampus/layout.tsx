import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ReactNode } from "react";

export default function SmartCampusLayout({ children }: { children: ReactNode }) {
  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  );
}
