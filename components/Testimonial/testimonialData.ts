import image1 from "@/public/images/user/user-01.png";
import image2 from "@/public/images/user/user-02.png";
import { Testimonial } from "@/types/testimonial";
export const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Mwangi",
    designation: "Lecturer, Department of Computer Science",
    image: image1,
    content:
      "The Smart Campus Management System has completely changed the way I manage my courses and communicate with students. With real-time updates and easy scheduling, it has streamlined both teaching and administrative tasks.",
  },
  {
    id: 2,
    name: "John Otieno",
    designation: "Student, Faculty of Engineering",
    image: image2,
    content:
      "As a student, the SCMS platform has made my academic life so much easier. From accessing lecture notes to booking study rooms and keeping track of my assignments, everything is organized and just a click away.",
  },
  {
    id: 3,
    name: "Emily Kimani",
    designation: "Administrative Officer",
    image: image1,
    content:
      "Managing university operations has never been smoother. SCMS has helped us automate administrative tasks like facility booking and student records, reducing paperwork and improving efficiency across the board.",
  },
];
