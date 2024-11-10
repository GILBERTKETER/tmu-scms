"use client";
import React from "react";
import CalenderComponent from "@/components/calender";
import LoadingLayout from "@/components/Layouts/LoadingLayout";

export default function Calendar() {
  return (
    <LoadingLayout>
      <CalenderComponent />
    </LoadingLayout>
  );
}