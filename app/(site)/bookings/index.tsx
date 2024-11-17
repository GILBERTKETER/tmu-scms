"use client";
import SidebarLink from "@/components/Bookings/SidebarLink";
import { useState } from "react";
import { Button } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
export default function Bookings() {
  const [activeTab, setActiveTab] = useState("classes");

  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return (
          <div>
            <h2 className="text-secondary">Book Classes</h2>
            <p>Select a class to book and check availability.</p>
          </div>
        );
      case "rooms":
        return (
          <div>
            <h2 className="text-secondary">Book Rooms</h2>
            <p>Select a room and reserve it for your needs.</p>
          </div>
        );
      case "facilities":
        return (
          <div>
            <h2 className="text-secondary">Book Facilities</h2>
            <p>Select from available facilities to book.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-1/4">
              <div className="sticky top-[74px] rounded-lg border border-white p-4 shadow-solid-4 transition-all dark:border-strokedark dark:bg-blacksection">
                <ul className="space-y-2">
                  <SidebarLink
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </ul>
              </div>
            </div>

            <div className="w-full px-4 lg:w-3/4">
              <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="relative mx-auto bg-white dark:bg-black ">
        <div className="relative pt-20">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-1/2 rounded-r-3xl bg-gray-800"></div>
            <svg
              className="absolute left-1/2 top-8 -ml-3"
              width="404"
              height="392"
              fill="none"
              viewBox="0 0 404 392"
            >
              <defs>
                <pattern
                  id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-gray-200"
                    fill="currentColor"
                  ></rect>
                </pattern>
              </defs>
              <rect
                width="404"
                height="392"
                fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
              ></rect>
            </svg>
          </div>
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-gray-700 px-6 py-10 shadow-xl sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 1463 360"
                >
                  <path
                    className="text-gray-600 text-opacity-40"
                    fill="currentColor"
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                  ></path>
                  <path
                    className="text-gray-800 text-opacity-40"
                    fill="currentColor"
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                  ></path>
                </svg>
              </div>
              <div className="relative flex flex-col">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white dark:text-white sm:text-4xl">
                    {" "}
                    Bookings and Updates
                  </h2>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-100">
                    {" "}
                    Get to know about the Bookings and notification features{" "}
                  </p>
                </div>
                <Button
                type="primary"
                  href="/auth/signin/"
                  className="mx-auto mt-5 inline-block w-auto rounded-md border border-transparent bg-gray-900 px-5 py-3 text-base font-medium text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-500 sm:px-10"
                >
                  Get started →
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-black dark:text-white">
          <div className="container mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-12 py-20 md:justify-between">
            <div className="grid justify-items-center gap-4 text-center md:flex-1">
              <div className=" rounded-full border-8 border-amber-400 p-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#22409a"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-14 w-14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-3xl text-primary font-bold">Schedule Classes</h3>
              <p>
                Plan and manage your classes seamlessly, ensuring optimal
                scheduling for both instructors and students.
              </p>
            </div>
            <div className="grid justify-items-center gap-4 text-center md:flex-1">
              <div className=" rounded-full border-8 border-amber-400 p-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#22409a"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-14 w-14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-3xl text-primary font-bold">Book Facilities</h3>
              <p>
                {" "}
                Effortlessly reserve classrooms, conference rooms, or other
                facilities through the SCMS booking system.
              </p>
            </div>
            <div className="grid justify-items-center gap-4 text-center md:flex-1">
              <div className=" rounded-full border-8 border-amber-400 p-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#22409a"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-14 w-14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-3xl text-primary font-bold">Get Notifications</h3>
              <p>
                Stay informed with real-time notifications about your classes,
                Bookings, schedule changes, and important updates through
                whatsapp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
