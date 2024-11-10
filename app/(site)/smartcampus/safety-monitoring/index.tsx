"use client"
import LoadingLayout from "@/components/Layouts/LoadingLayout";
import SafetyMonitoring from "@/components/safetyMonitoring"

export default function CampusMap() {
  return (
    <LoadingLayout>
      <SafetyMonitoring />
    </LoadingLayout>
  );
}
