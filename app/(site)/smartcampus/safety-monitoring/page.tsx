import { Metadata } from "next";
import SafetyMonitoring from "./index";
export const metadata: Metadata = {
  title: "Safety Monitoring - Smart Campus",
  description:
    "Stay informed with real-time safety updates and monitor campus security for a safe and secure environment.",
};

export default function SaafetyMonitoring() {
  return <SafetyMonitoring />;
}
