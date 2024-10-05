import { Card, Space } from "@arco-design/web-react";
import React from "react";

interface CardsProps {
  title: string;
  content: React.ReactNode;
  contentclass: string;
}

const Cards: React.FC<CardsProps> = ({ title, content, contentclass }) => {
  return (
    <div>
      <Space>
        <Card
          style={{width:"300px"}}
          title={title}
          className="card-custom-hover-style"
          hoverable
        >
          <p className={`${contentclass}`}>{content}</p>
        </Card>
      </Space>
    </div>
  );
};

export default Cards;
