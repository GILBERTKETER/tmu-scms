import React from 'react';
import { Grid, Card, Typography, List } from '@arco-design/web-react';
import { IconCalendar, IconHome, IconCommon } from '@arco-design/web-react/icon';
import StatisticalCards from './StatisticalCards';

const { Row, Col } = Grid;

function Dashboard() {
  const upcomingMeetings = [
    { id: 1, name: 'Board Meeting', hall: 'Hall A', time: '2024-10-07 10:00 AM' },
    { id: 2, name: 'Faculty Conference', hall: 'Hall B', time: '2024-10-08 02:00 PM' },
    { id: 3, name: 'Student Orientation', hall: 'Hall C', time: '2024-10-09 09:00 AM' },
  ];

  const ongoingActivities = [
    { id: 1, name: 'Art Exhibition', hall: 'Hall D', endTime: '2024-10-10 06:00 PM' },
    { id: 2, name: 'Science Fair', hall: 'Hall E', endTime: '2024-10-11 05:00 PM' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title className="text-primary">Hall Managements</Typography.Title>
      
      <StatisticalCards totalHalls={20} bookedHalls={16} />
      
      <Row gutter={24} style={{ marginTop: '20px' }}>
      <Col span={12} lg={12} sm={24} xs={24} style={{marginBottom:"20px"}}>
      <Card>
            <Typography.Title heading={6}>Upcoming Meetings</Typography.Title>
            <List
              dataSource={upcomingMeetings}
              render={(item, index) => (
                <List.Item key={item.id}>
                  <div>
                    <Typography.Text strong>{item.name}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {item.hall} - {item.time}
                    </Typography.Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12} lg={12} sm={24} xs={24}  style={{marginBottom:"20px"}}>
          <Card>
            <Typography.Title heading={6}>Ongoing Activities</Typography.Title>
            <List
              dataSource={ongoingActivities}
              render={(item, index) => (
                <List.Item key={item.id}>
                  <div>
                    <Typography.Text strong>{item.name}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {item.hall} - Ends: {item.endTime}
                    </Typography.Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;