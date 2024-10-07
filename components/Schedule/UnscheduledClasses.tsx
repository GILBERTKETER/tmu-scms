import { Table, Button, Space } from '@arco-design/web-react';
import { IconCalendar } from '@arco-design/web-react/icon';
import ScheduleClassModal from './ScheduleClassModal'
const data = [
  { key: '1', class: 'Chemistry', description: 'Organic Chemistry Basics' },
  { key: '2', class: 'History', description: 'World War II' },
];

const UnscheduledClasses: React.FC = () => {
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
         <ScheduleClassModal/>
        </Space>
      ),
    },
  ];

  const handleSchedule = (record) => {
    // Action to schedule the class
    console.log('Scheduling class:', record);
    // Open a modal or navigate to scheduling form
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Unscheduled Classes</h2>
      <Table data={data} columns={columns} pagination={false} />
    </div>
  );
};

export default UnscheduledClasses;
