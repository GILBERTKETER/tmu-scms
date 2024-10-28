"use client";
import React from "react";
import ActivityManagement from "./ActivityManagement";
import ClassSchedule from "./ClassSchedule";
import HallManagement from "./HallManagement";
import Board from "./Board";
const Home: React.FC = () => {
  return (
    <div>
      <Board />
      <HallManagement />
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <ActivityManagement />
        <ClassSchedule />
      </div>
    </div>
  );
};

export default Home;
