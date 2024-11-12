import React from 'react';
import {
  Card,
  Table,
  Typography,
  Badge,
  Grid,
  Space,
  Descriptions,
  Tag
} from '@arco-design/web-react';
import { IconClockCircle, IconCalendar } from '@arco-design/web-react/icon';
import App from '@/app/(site)/api/api';
const { Row, Col } = Grid;
const { Title, Text } = Typography;

interface Schedule {
  start_time: string;
  end_time: string;
  course_name: string;
  course_code: string;
  enrollment_id: number;
}

interface DaySchedule {
  schedules: Schedule[];
  total_classes: number;
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

interface CurrentClass {
  course_name: string;
  course_code: string;
  end_time: string;
}

interface NextClass {
  course_name: string;
  course_code: string;
  start_time: string;
}

interface CurrentStatus {
  status: 'Occupied' | 'Available';
  current_class: CurrentClass | null;
  next_class: NextClass | null;
}

interface Hall {
  id: number;
  hall_name: string;
  hall_number: string;
  hall_capacity: number;
  current_status: CurrentStatus;
  weekly_schedule: WeeklySchedule;
}

interface HallsDisplayProps {
  halls: Hall[];
  currentDay: string;
  currentTime: string;
}

const HallsDisplay: React.FC<HallsDisplayProps> = ({ halls, currentDay, currentTime }) => {
  const columns = [
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Course',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (text: string, record: Schedule) => (
        <Space>
          <Text>{text}</Text>
          <Tag color="arcoblue">{record.course_code}</Tag>
        </Space>
      ),
    },
  ];

  return (
    <div className="halls-display">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row align="center" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <IconCalendar /> 
              <Text>{currentDay}</Text>
              <IconClockCircle />
              <Text>{currentTime}</Text>
            </Space>
          </Col>
        </Row>

        {halls.map((hall) => (
          <Card key={hall.id}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Hall Header */}
              <Row justify="space-between" align="center">
                <Col>
                  <Title heading={4}>
                    {hall.hall_name} {hall.hall_number}
                  </Title>
                </Col>
                <Col>
                  <Badge
                    status={hall.current_status.status === 'Occupied' ? 'danger' : 'success'}
                    text={hall.current_status.status}
                  />
                </Col>
              </Row>

              {/* Hall Details */}
              <Descriptions
                column={2}
                data={[
                  {
                    label: 'Hall Capacity',
                    value: hall.hall_capacity,
                  },
                  {
                    label: 'Current Class',
                    value: hall.current_status.current_class ? (
                      <Space>
                        <Text>
                          {hall.current_status.current_class.course_name} 
                          ({hall.current_status.current_class.course_code})
                        </Text>
                        <Tag color="red">
                          Ends at {hall.current_status.current_class.end_time}
                        </Tag>
                      </Space>
                    ) : 'No ongoing class',
                  },
                  {
                    label: 'Next Class',
                    value: hall.current_status.next_class ? (
                      <Space>
                        <Text>
                          {hall.current_status.next_class.course_name} 
                          ({hall.current_status.next_class.course_code})
                        </Text>
                        <Tag color="green">
                          Starts at {hall.current_status.next_class.start_time}
                        </Tag>
                      </Space>
                    ) : 'No upcoming class',
                  },
                ]}
              />

              {/* Weekly Schedule */}
              <div>
                <Title heading={5}>Weekly Schedule</Title>
                {Object.entries(hall.weekly_schedule).map(([day, schedule]) => (
                  <Card
                    key={day}
                    style={{ marginTop: 16 }}
                    title={
                      <Space>
                        <Text bold>{day}</Text>
                        <Tag>{schedule.total_classes} classes</Tag>
                      </Space>
                    }
                  >
                    {schedule.total_classes > 0 ? (
                      <Table
                        columns={columns}
                        data={schedule.schedules}
                        pagination={false}
                        size="small"
                      />
                    ) : (
                      <Text type="secondary">No classes scheduled</Text>
                    )}
                  </Card>
                ))}
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default HallsDisplay;