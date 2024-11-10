import { Metadata } from "next";
import Reporting from "./index"
export const metadata: Metadata = {
  title: "Incident Reporting - Smart Campus",
  description:
    "Report and track campus incidents promptly and securely to ensure a safe and supportive environment.",
};



export default function IncidentReporting() {
  return (
      <Reporting/>
  );
}
