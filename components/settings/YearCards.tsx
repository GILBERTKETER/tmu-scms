import { Card, Link, Space } from '@arco-design/web-react';
import React from 'react';

interface CardTypes {
  title: string;
  semester: number;
  numberOfCourses: number;
  EnrolledStudents: number;
}

function YearCards({ title, semester, numberOfCourses, EnrolledStudents }: CardTypes) {
  return (
    <div className="p-4">
      <Space>
        <Card
          style={{ width: 360 }}
          title={title}
          hoverable
          extra={<Link>More</Link>}
        >
          <div className="text-lg font-semibold mb-2">Semester: {semester}</div>
          <div>Number of Courses: {numberOfCourses}</div>
          <div>Enrolled Students: {EnrolledStudents}</div>
        </Card>
      </Space>
    </div>
  );
}

export default YearCards;
