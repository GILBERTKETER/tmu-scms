import React from "react";
import { Typography } from "@arco-design/web-react";
import { useAuth } from "@/context/Auth";
import StatisticalCards from "./StatisticalCards";
import AddHall from "./AddHall";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex w-full items-center justify-between">
        <Typography.Title className="text-primary ">
          Hall Managements
        </Typography.Title>
        {user?.role == "student" || user?.role == "classrep" ? null : <AddHall />}
      </div>
      <StatisticalCards />
    </div>
  );
}

export default Dashboard;
