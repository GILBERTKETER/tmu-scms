"use client"
import Reporting from "@/components/safetyReporting"
import LoadingLayout from "@/components/Layouts/LoadingLayout";

export default function CampusMap() {
  return (
    <LoadingLayout>
      <Reporting />
    </LoadingLayout>
  );
}
