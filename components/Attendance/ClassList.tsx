// components/ClassList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button } from "@arco-design/web-react";
import StudentCheckInDrawer from "./StudentCheckInDrawer";
import { IconEdit } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
const ClassList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [classData, setClassData] = useState<any[]>([]);

  const openDrawer = (classItem: any) => {
    setSelectedClass(classItem);
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    setSelectedClass(null);
  };

  const columns = [
    { title: "Course Name", dataIndex: "course_name" },
    { title: "Course Code", dataIndex: "course_code" },
    { title: "Program Name", dataIndex: "program_name" },
    { title: "Instructor Name", dataIndex: "instructor_name" },
    { title: "Hall Name", dataIndex: "hall_name" },
    { title: "Hall Number", dataIndex: "hall_number" },
    { title: "Date", dataIndex: "date" },
    { title: "Start Time", dataIndex: "time_start" },
    { title: "End Time", dataIndex: "time_end" },
    { title: "Recurring Days", dataIndex: "recurring_days" },
    {
      title: "Actions",
      render: (text: string, record: any) => (
        <Button type="text" onClick={() => openDrawer(record)}>
          <IconEdit />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await App.get('/api/get-scheduled-classes/'); 
        
        if (response.data.success) {
          setClassData(response.data.classes);
        } else {
          console.error('Failed to fetch classes:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <Table
        style={{ width: "100%" }}
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
