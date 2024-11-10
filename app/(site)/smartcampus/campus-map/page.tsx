import { Metadata } from "next";
import Map from "./index";
export const metadata: Metadata = {
  title: "Campus Map - Smart Campus",
  description:
    "Explore the Smart Campus map to find buildings, facilities, and navigate your way around campus easily.",
};

export default function CampusMap() {
  return <Map />;
}
