"use client"
import React from 'react';
import ActivityManagement from './ActivityManagement';
import ClassSchedule from './ClassSchedule';
import HallManagement from './HallManagement';
import Board from './Board';
const Home: React.FC = () => {
  return (
    <div>
        <Board/>
      <HallManagement/>
      <ActivityManagement/>
      <ClassSchedule/>
    </div>
  );
};

export default Home;
