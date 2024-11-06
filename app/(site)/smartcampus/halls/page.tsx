import { Metadata } from "next";
import Bookings from '@/components/HallBooking'
export const metadata: Metadata = {
  title: "Dashboard - Smart Campus",
  description: "Access your personalized dashboard with a quick overview of your classes, assignments, and campus notifications.",
};


export default function BookingsPage() {
  return (
    <>
      <Bookings/>
      {/* <h2>hello</h2> */}
    </>
  );
}
