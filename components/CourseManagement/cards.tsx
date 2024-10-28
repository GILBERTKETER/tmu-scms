import React from "react";
import { Card, Grid, Link } from "@arco-design/web-react";
import EnrolledCourses from "./EnrolledList";
import Details from "./Details";
import DetailsDrawer from "./DetailsDrawer"
function Cards() {
  const extra = <DetailsDrawer/>;
  return (
    <div
    style={{
      boxSizing: "border-box",
      width: "100%",
      padding: "10px",
      backgroundColor: "var(--color-fill-2)",
      marginBottom: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
    }}
  >
    <Card
      title="Arco Card"
      bordered={false}
      style={{
        width: "100%",
        height: "100%", 
      }}
    >
      <EnrolledCourses />
    </Card>
    <Card
      title="Arco Card"
      extra={extra}
      bordered={false}
      style={{
        width: "100%", 
        height: "100%", 
      }}
    >
      <Details />
    </Card>
  </div>
  
  );
}

export default Cards;