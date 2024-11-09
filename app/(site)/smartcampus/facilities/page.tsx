import { Metadata } from "next";
import Facilities from "./index"
export const metadata: Metadata = {
  title: "Facilities Management - Smart Campus",
  description:
    "Manage campus facilities with ease. View, book, and organize available spaces and resources for your classes and events.",
};

export default function FacilitiesPage() {
  return (
    <>
      <Facilities/>
    </>
  );
}
