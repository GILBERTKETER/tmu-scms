import React from 'react'
import { Metadata } from "next";
import Bookings from '.';
export const metadata: Metadata = {
  title: "Facility Bookings - Smart Campus",
  description: "Reserve university facilities, classrooms, and other campus resources with the Smart Campus facility booking system.",
};
import HomeLayout from "@/components/Layouts/homeLayout"

function Book() {
  return (
    <div>
      <HomeLayout>
      <Bookings/>
      </HomeLayout>
    </div>
  )
}

export default Book
