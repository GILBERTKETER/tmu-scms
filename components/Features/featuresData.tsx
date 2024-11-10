import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 3h18v18H3V3z" fill="#2196F3" />
        <path d="M6 6h12v2H6V6zm0 4h12v2H6v-2zm0 4h12v2H6v-2z" fill="#FFF" />
      </svg>
    ),
    title: "Personalized Student Dashboard - Smart Campus",
  description:
    "Access a customized dashboard with your class schedules, campus events, real-time notifications, and important academic updates.",
  },
  {
    id: 2,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="#4CAF50" />
        <path
          d="M12 6v6h4"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="1" fill="#FFF" />
      </svg>
    ),
    title: "AI-based Academic Advisor",
    description:
      "Chatbot that helps students select courses based on academic progress and career goals.",
  },
  {
    id: 3,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="4" width="16" height="16" fill="#FF9800" />
        <path
          d="M4 10h16M4 14h16"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Automated Class Scheduling",
    description:
      "Real-time scheduling based on room availability and student preferences, with notifications for changes.",
  },
  {
    id: 4,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="4" width="18" height="16" fill="#3F51B5" />
        <path
          d="M4 8h16v8H4V8zm0 0v8M8 12v4"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Facility Booking System",
    description:
      "Online booking for university facilities with real-time availability and admin oversight.",
  },
  {
    id: 5,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 20h18V4H3v16z" fill="#F44336" />
        <path
          d="M7 18l5-10 3 6 3-5"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
    title: "Attendance Monitoring System",
    description:
      "QR code or RFID-based check-in for class attendance integrated with the student dashboard.",
  },
  {
    id: 6,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="4" width="18" height="16" fill="#9C27B0" />
        <path
          d="M12 16v-8m4 4H8"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Whatsapp API - Class Broadcasts",
    description:
      "Use WhatsApp API to broadcast class schedules, updates, and notifications directly to students for efficient communication.",
  },
  {
    id: 7,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="4" width="16" height="16" fill="#2196F3" />
        <path
          d="M6 8h12v8H6V8zm0 0l3 3m-3-3l-3 3"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Celery Integration - Task Management",
    description:
      "Leverage Celery for efficient background task processing, enabling smooth submission, feedback, and document management workflows.",
  },
  {
    id: 8,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 4h16v16H4V4z" fill="#FF5722" />
        <path d="M12 16l-4-4 4-4 4 4-4 4z" fill="#FFF" />
      </svg>
    ),
    title: "Interactive Campus Map",
    description:
      "Real-time navigation and tracking of campus buildings and events.",
  },
  {
    id: 9,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z"
          fill="#8BC34A"
        />
        <path
          d="M12 7v6m0 0h2m-2 0h-2"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Health and Safety Monitoring",
    description:
      "Health check-in module to monitor symptoms and notify students of health risks.",
  },
];

export default featuresData;
