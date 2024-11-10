"use client"
import Map from "@/components/campusMap/index";
import LoadingLayout from "@/components/Layouts/LoadingLayout";

export default function CampusMap() {
  return (
    <LoadingLayout>
      <Map />
    </LoadingLayout>
  );
}
