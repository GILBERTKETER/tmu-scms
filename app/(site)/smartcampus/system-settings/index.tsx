"use client"
import LoadingLayout from "@/components/Layouts/LoadingLayout";
import SettingsComponent from "@/components/settings";

export default function CampusMap() {
  return (
    <LoadingLayout>
      <SettingsComponent />
    </LoadingLayout>
  );
}
