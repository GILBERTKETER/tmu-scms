import React from "react";
import { Metadata } from "next";
import SettingsComponent from "./index";
export const metadata: Metadata = {
  title: "Settings - Smart Campus",
  description:
    "Customize your Smart Campus experience by managing account preferences, notifications, and privacy settings.",
};

function SettingsPage() {
  return <SettingsComponent />;
}

export default SettingsPage;
