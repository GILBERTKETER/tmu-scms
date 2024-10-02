import { Metadata } from "next";
import React from 'react'
import Advisor from '.'
export const metadata: Metadata = {
  title: "AI Academic Advisor - Smart Campus",
  description:
    "Get personalized course recommendations and academic advice to optimize your university journey. Stay on track with tailored suggestions from the AI Academic Advisor.",
};
function page() {
  return (
    <div>
      <Advisor/>
    </div>
  )
}

export default page
