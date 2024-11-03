import React from "react";
import { Grid, Card, Typography, List } from "@arco-design/web-react";
import {
  IconCalendar,
  IconHome,
  IconCommon,
} from "@arco-design/web-react/icon";
import StatisticalCards from "./StatisticalCards";
import AddHall from "./AddHall";
const { Row, Col } = Grid;

function Dashboard() {
  const upcomingMeetings = [
    {
      id: 1,
      name: "Board Meeting",
      hall: "Hall A",
      time: "2024-10-07 10:00 AM",
    },
    {
      id: 2,
      name: "Faculty Conference",
      hall: "Hall B",
      time: "2024-10-08 02:00 PM",
    },
    {
      id: 3,
      name: "Student Orientation",
      hall: "Hall C",
      time: "2024-10-09 09:00 AM",
    },
  ];

  const ongoingActivities = [
    {
      id: 1,
      name: "Art Exhibition",
      hall: "Hall D",
      endTime: "2024-10-10 06:00 PM",
    },
    {
      id: 2,
      name: "Science Fair",
      hall: "Hall E",
      endTime: "2024-10-11 05:00 PM",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex w-full items-center justify-between">
        <Typography.Title className="text-primary ">
          Hall Managements
        </Typography.Title>
        <AddHall />
      </div>
      <StatisticalCards />
    </div>
  );
}

export default Dashboard;
