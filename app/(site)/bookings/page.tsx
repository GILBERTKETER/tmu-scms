import React from 'react'
import { Metadata } from "next";
import Bookings from '.';
export const metadata: Metadata = {
  title: "Booking System - Tom Mboya University",
  description: "Easily book classes, rooms, and facilities at Tom Mboya University.",
  // other metadata
};
function Book() {
  return (
    <div>
      <Bookings/>
    </div>
  )
}

export default Book
