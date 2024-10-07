import { Table, } from '@arco-design/web-react';

const data = [
  { key: '1', date: '2024-10-01', status: 'Present', method: 'RFID' },
  { key: '2', date: '2024-10-02', status: 'Absent', method: 'Manual' },
];

const AttendanceLogs: React.FC = () => {
  const columns = [
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

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Attendance Logs</h2>
      <Table data={data} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default AttendanceLogs;
