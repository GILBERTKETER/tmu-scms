"use client";
import React from "react";
import { Card, Tabs, Link } from "@arco-design/web-react";
import DashboardBarChart from "./DashboardChart";
const TabPane = Tabs.TabPane;

const App = () => {
  return (
    <div className="flex h-full w-full flex-col gap-10 lg:flex-row">
      <div className="flex h-full w-full flex-row gap-4 sm:flex-col lg:w-1/4">
        <Card
          title="Card with Tab"
        //   extra={<Link>More</Link>}
          style={{
            width: "100%",
            maxWidth:"50% !important",
            height: "50% !important",
          }}
        >
         heey<br></br>
         heey<br></br>
         heey<br></br>
         heey<br></br>
         heey<br></br>
         heey<br></br>
       
        </Card>
        <Card
          title="Card with Tab"
        //   extra={<Link>More</Link>}
          style={{
            width: "100%",
            maxWidth:"50% !important",
            height: "50% !important",
          }}
        >
         heeey
         heey<br></br>
         heey<br></br>
         heey<br></br>
         heey<br></br>
         heey<br></br>
         heey<br></br>
        </Card>
      </div>

      <div className="h-full w-full lg:w-3/4">
        <DashboardBarChart />
      </div>
    </div>
  );
};

export default App;
