import React, { useEffect, useState } from 'react';
import { Table } from '@arco-design/web-react';
import App from '@/app/(site)/api/api';
import "./styles.css"
const AttendanceLogs = () => {
  const [data, setData] = useState([]);

  const columns = [

    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Check-In Method',
      dataIndex: 'method',
      key: 'method',
    },
  ];

  useEffect(() => {
    // Fetch attendance logs from Django API
    const fetchAttendanceLogs = async () => {
      try {
        const response = await App.get('/api/attendance-logs/');

        setData(response.data.logs);
      } catch (error) {
        console.error('Error fetching attendance logs:', error);
      }
    };

    fetchAttendanceLogs();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Attendance Logs</h2>
      <div className="responsive-container">
        <Table
          className="responsive-container"
          data={data} columns={columns} pagination={{ pageSize: 5 }} />
      </div>

    </div>
  );
};

export default AttendanceLogs;
