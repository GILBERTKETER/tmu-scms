import React from 'react';
import { Card, Statistic, Grid } from '@arco-design/web-react';
import { IconHome, IconBook, IconThunderbolt } from '@arco-design/web-react/icon';

const FacilityDashboard: React.FC = () => {
    const {Row, Col} = Grid;
  const facilitySummary = [
    { title: 'Halls', count: 8, icon: <IconHome />, available: 4, booked: 4 },
    { title: 'Computer Labs', count: 3, icon: <IconThunderbolt />, available: 1, booked: 2 },
    { title: 'Libraries', count: 2, icon: <IconBook />, available: 1, booked: 1 },
    { title: 'Amphitheaters', count: 1, icon: <IconThunderbolt />, available: 1, booked: 0 },
  ];

  return (
    <Row gutter={24}>
      {facilitySummary.map((facility, index) => (
        <Col className="border" style={{width:"100%"}} key={index} span={6} xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic 
              title={facility.title} 
              value={facility.count} 
              suffix="Facilities" 
              icon={facility.icon} 
            />
            <div className="flex justify-between mt-4">
              <span>Available: {facility.available}</span>
              <span>Booked: {facility.booked}</span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default FacilityDashboard;
