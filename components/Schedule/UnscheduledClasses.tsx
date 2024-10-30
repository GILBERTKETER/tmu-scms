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
        const response = await App.get('/api/unscheduled-classes/'); 
        setUnscheduledClasses(response.data);
      } catch (error) {
        toast.error(error.message || "An error occured during getting the classes.")
      }
    };

    fetchUnscheduledClasses();
  }, []);

  const columns = [
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ScheduleClassModal classRecord={record} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Unscheduled Classes</h2>
      <Table data={unscheduledClasses} columns={columns} pagination={false} />
    </div>
  );
};

export default UnscheduledClasses;
