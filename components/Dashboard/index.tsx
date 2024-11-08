"use client";
import React from "react";
import DashboardCard from "./StatsCard";
import ClassAndAnnouncments from "./ClassAndAnnouncments";
import InfoAndChart from "./InfoAndChart";
const Dashboard: React.FC = () => {
  return (
    <div
      className="flex flex-col gap-10"
      style={{
        height: window.innerWidth >= 1024 ? "85vh" : "auto",
      }}
    >
      <div className="relative" style={{ height: "15%" }}>
        <DashboardCard />
      </div>
      <div className="relative" style={{ height: "30%" }}>
        <ClassAndAnnouncments />
      </div>
      <div className="relative" style={{ height: "55%" }}>
        <InfoAndChart />
      </div>
    </div>
  );
};

export default Dashboard;
