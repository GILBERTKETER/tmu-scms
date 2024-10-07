import React from 'react';
import { Grid, Card, Typography, Progress } from '@arco-design/web-react';
import { IconCalendar, IconHome } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
interface HallTypes {
     totalHalls: Number,
    bookedHalls: Number,
    availableHalls: Number,
    bookingPercentage: Number,
}

function StatisticalCards({ totalHalls, bookedHalls }:HallTypes) {
  const availableHalls = totalHalls - bookedHalls;
  const bookingPercentage = (bookedHalls / totalHalls) * 100;

  return (
    <Row gutter={24}>
      <Col span={12} lg={12} xl={12} sm={24} xs={24} style={{marginBottom: "20px"}}>
        <Card>
          <IconHome style={{ fontSize: 24, marginBottom: 16, color: '#165DFF' }} />
          <Row gutter={24} className="flex items-center" justify='space-between' align="center">
            <Col span={12} >
          <Typography.Title heading={6} className="text-primary">Halls Status</Typography.Title>
              <Typography.Text>Booked: {bookedHalls}</Typography.Text>
              <br />
              <Typography.Text>Available: {availableHalls}</Typography.Text>
            </Col>
            <Col span={12} style={{display:"flex", alignItems:"center"}} className="relative  flex items-center justify-center">
              <Progress
              className="text-secondary"
                type="circle"
                percent={bookingPercentage}
                size="large"
                style={{ width: 80 }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={12} lg={12} xl={12} sm={24} xs={24} style={{marginBottom: "20px"}}>
        <Card>
          <IconCalendar style={{ fontSize: 24, marginBottom: 16, color: '#14C9C9' }} />
          <Typography.Title heading={6} className="text-primary">Upcoming Events</Typography.Title>
          <Typography.Text>Next 7 days: <span className="text-secondary">5 events</span></Typography.Text>
          <br />
          <Typography.Text>This month: <span className='text-secondary'>12 events</span></Typography.Text>
        </Card>
      </Col>
    </Row>
  );
}

export default StatisticalCards;