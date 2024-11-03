import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Progress } from '@arco-design/web-react';
import { IconCalendar, IconHome } from '@arco-design/web-react/icon';
import App from "@/app/(site)/api/api"

const { Row, Col } = Grid;

interface HallTypes {
  totalHalls: number;
  bookedHalls: number;
  availableHalls: number;
  bookingPercentage: number;
}

function StatisticalCards() {
  const [hallStatus, setHallStatus] = useState<HallTypes | null>(null);

  useEffect(() => {
    // Fetch hall status from the API
    const fetchHallStatus = async () => {
      try {
        const response = await App.get('/api/halls-status/'); 
        const data = response.data;

        setHallStatus({
          totalHalls: data.total_halls,
          bookedHalls: data.booked_halls,
          availableHalls: data.available_halls,
          bookingPercentage: data.booked_percentage,
        });
      } catch (error) {
        console.error('Error fetching hall status:', error);
      }
    };

    fetchHallStatus();
  }, []);

  if (!hallStatus) {
    return <p>Loading...</p>; // You can replace this with a loading spinner if you prefer
  }

  return (
    <Row gutter={24}>
      <Col span={12} lg={12} xl={12} sm={24} xs={24} style={{ marginBottom: '20px' }}>
        <Card>
          <IconHome style={{ fontSize: 24, marginBottom: 16, color: '#165DFF' }} />
          <Row gutter={24} className="flex items-center" justify="space-between" align="center">
            <Col span={12}>
              <Typography.Title heading={6} className="text-primary">
                Halls Status
              </Typography.Title>
              <Typography.Text>Booked: {hallStatus.bookedHalls}</Typography.Text>
              <br />
              <Typography.Text>Available: {hallStatus.availableHalls}</Typography.Text>
            </Col>
            <Col
              span={12}
              style={{ display: 'flex', alignItems: 'center' }}
              className="relative flex items-center justify-center"
            >
              <Progress
                className="text-secondary"
                type="circle"
                percent={hallStatus.bookingPercentage}
                size="large"
                style={{ width: 80 }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      
    </Row>
  );
}

export default StatisticalCards;
