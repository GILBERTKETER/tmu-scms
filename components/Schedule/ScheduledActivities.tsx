import { List, Button, Space, Typography } from '@arco-design/web-react';
import { IconEdit, IconPlus } from  '@arco-design/web-react/icon';
import ScheduleActivityModal from "./ScheduleActivityModal"
const data = [
  { title: 'Faculty Meeting', description: 'Department meeting to discuss semester plans' },
  { title: 'Sports Event', description: 'Inter-college football match' },
];

const ScheduledActivities: React.FC = () => {
  const handleEdit = (item) => {
    // Edit the schedule for the activity
    console.log('Editing activity:', item);
    // Open a modal to edit the schedule
  };

  const handleAdd = () => {
    // Add a new activity to the schedule
    console.log('Adding new activity');
    // Open a modal to add new activity
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-xl font-semibold">Scheduled Activities</h2>
       <ScheduleActivityModal/>
      </div>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button icon={<IconEdit />} onClick={() => handleEdit(item)}>
                Edit
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<Typography.Text>{item.title}</Typography.Text>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ScheduledActivities;
