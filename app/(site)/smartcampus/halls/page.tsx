import { Metadata } from "next";
import Bookings from './index'
export const metadata: Metadata = {
  title: "Halls Management - Smart Campus",
  description:
    "Manage and book campus halls for events, classes, and other activities. Stay organized with our easy-to-use hall management system.",
};
export default function BookingsPage() {
  return (
    <>
      <Bookings/>
    </>
  );
}
