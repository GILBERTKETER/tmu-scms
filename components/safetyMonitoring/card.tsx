import { Card, Grid } from "@arco-design/web-react";
import React from "react";

interface CardsProps {
  title: string;
  content: React.ReactNode;
  contentclass: string;
}

const Cards: React.FC<CardsProps> = ({ title, content, contentclass }) => {
  return (

    <Card
      style={{ width: "100%" }}
      title={title}
      className="card-custom-hover-style"
      hoverable
    >
      <p className={`${contentclass}`}>{content}</p>
    </Card>

  );
};

export default Cards;
