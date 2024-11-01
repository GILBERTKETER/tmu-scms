import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from '@arco-design/web-react';
import { IconCalendar } from '@arco-design/web-react/icon';
import ScheduleClassModal from './ScheduleClassModal';
import App from '@/app/(site)/api/api';
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const UnscheduledClasses: React.FC = () => {
  const [unscheduledClasses, setUnscheduledClasses] = useState([]);

  useEffect(() => {
    const fetchUnscheduledClasses = async () => {
      try {
        const response = await App.get('/api/get-unscheduled-courses/');
       
        setUnscheduledClasses(response.data.data);
      } catch (error) {
        toast.error(error.message || "An error occurred while fetching the classes.");
      }
    };

    fetchUnscheduledClasses();
  }, []);

  const columns = [
    {
      title: 'Class',
      dataIndex: 'course_name',
      key: 'class',
    },
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
    },
   
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ScheduleClassModal course_code={record.course_code} course_id={record.course_id} course_name={record.course_name} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Unscheduled Classes</h2>
      <Table data={unscheduledClasses} columns={columns} pagination={false} />
      <ToastContainer />
    </div>
  );
};

export default UnscheduledClasses;
