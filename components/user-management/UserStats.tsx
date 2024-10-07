// components/UserStats.tsx
import React from 'react';
import { Card, Grid, Statistic } from '@arco-design/web-react';
import { IconUser, IconUserGroup } from '@arco-design/web-react/icon';
const UserStats: React.FC = () => {
  const {Row, Col} = Grid;
  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
          styleValue={{color:"#22409a"}}

            title="Total Students"
            value={1523}
            prefix={<IconUser style={{color:"#fcb815"}} fontSize={32} strokeWidth={4} />}
            suffix="students"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
          styleValue={{color:"#22409a"}}
            title="Total Staff"
            value={124}
            prefix={<IconUserGroup style={{color:"#fcb815"}} fontSize={32} strokeWidth={4} />}
            suffix="staff"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
                    styleValue={{color:"#22409a"}}
            title="Class Reps"
            value={32}
            prefix={<IconUser style={{color:"#fcb815"}} fontSize={32} strokeWidth={4} />}
            suffix="students"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
                    styleValue={{color:"#22409a"}}

            title="Lecturers"
            value={57}
            prefix={<IconUserGroup style={{color:"#fcb815"}} fontSize={32} strokeWidth={4} />}
            suffix="lecturers"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStats;
