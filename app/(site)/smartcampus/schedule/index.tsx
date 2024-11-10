"use client"
import LoadingLayout from "@/components/Layouts/LoadingLayout";
import Scheduler from "@/components/Schedule";

export default function CampusMap() {
  return (
    <LoadingLayout>
      <Scheduler />
    </LoadingLayout>
  );
}
