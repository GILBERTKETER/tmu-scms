"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/DashboardHeader";
import LoadingLayout from "./LoadingLayout";
import AutoModal from "./AutoModal";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <LoadingLayout>
        <AutoModal/>
        <div className="flex h-[100vh]" style={{ overflow: "hidden" }}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div
            className={`lg:ml-72.5 relative flex flex-1 flex-col ${sidebarOpen ? "z-[-1]" : ""}`}
          >
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main style={{ overflow: "auto" }}>
              <div
                style={{ overflow: "auto" }}
                className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10"
              >
                {children}
              </div>
            </main>
          </div>
        </div>
      </LoadingLayout>
    </>
  );
}
