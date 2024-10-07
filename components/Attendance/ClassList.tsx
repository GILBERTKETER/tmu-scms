// components/ClassList.tsx
import React, { useState } from "react";
import { Table, Button } from "@arco-design/web-react";
import StudentCheckInDrawer from "./StudentCheckInDrawer";
import { IconEdit } from "@arco-design/web-react/icon";

const classData = [
  { id: 1, name: "Mathematics", room: "101" },
  { id: 2, name: "Biology", room: "102" },
  { id: 3, name: "Chemistry", room: "103" },
  // Add more classes as needed
];

const ClassList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const openDrawer = (classItem: any) => {
    setSelectedClass(classItem);
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    setSelectedClass(null);
  };

  const columns = [
    { title: "Class Name", dataIndex: "name" },
    { title: "Room", dataIndex: "room" },
    {
      title: "Actions",
      render: (text: string, record: any) => (
        <Button type="text" onClick={() => openDrawer(record)}>
          <IconEdit />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        style={{ width:"100%"}}
        columns={columns}
        data={classData}
        pagination={false}
        rowKey="id"
        className="w-full"
      />
      <StudentCheckInDrawer
        visible={visible}
        onClose={closeDrawer}
        classItem={selectedClass}
      />
    </div>
  );
};

export default ClassList;
