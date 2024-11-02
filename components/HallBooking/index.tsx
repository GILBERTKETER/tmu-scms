"use client";
import React from "react";
import HallManagement from "./HallManagement";
import Board from "./Board";
const Home: React.FC = () => {
  return (
    <div>
      <Board />
      <HallManagement />
    </div>
  );
};

export default Home;
