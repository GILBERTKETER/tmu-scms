// components/AttendanceCards.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@arco-design/web-react";
import { IconCheckCircle, IconClockCircle } from "@arco-design/web-react/icon";
import { Grid } from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
const AttendanceCards: React.FC = () => {
  const Row = Grid.Row;
  const Col = Grid.Col;

  const [totalAttendance, setTotalAttendance] = useState(0);
  const [missedClasses, setMissedClasses] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        const response = await App.get('/api/attendance-logs/');
        
        if (response.data.success) {
          const attendanceRecords = response.data.logs;
          const enrolled_classes = response.data.total_count_enrolled
          // Get unique courses
          // const uniqueCourses = new Set(attendanceRecords.map(record => record.course));
          const totalClasses = enrolled_classes * 12; // Each course has 12 sessions
  
          // Calculate present count across all records
          const presentCount = attendanceRecords.length;
          const missedCount = totalClasses - presentCount;
  
          // Calculate attendance percentage to 5 decimal places
          const attendancePercentage = Number(((presentCount / totalClasses) * 100).toFixed(5));
          console.log("Attendance percentage:", attendancePercentage)
          setTotalAttendance(presentCount);
          setMissedClasses(missedCount);
          setAttendancePercentage(attendancePercentage);
          console.log("Attendance percentage from state:", attendancePercentage)
          console.log("Missed:", missedClasses)
          console.log("Missed count from state:", missedCount)

        } else {
          console.error('Failed to fetch attendance logs:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching attendance logs:', error);
      }
    };
  
    fetchAttendanceLogs();
  }, []);
  

  return (
    <Row gutter={24} style={{ boxSizing: "border-box", overflow: "auto" }}>
      <Col xs={24} sm={24} md={24} lg={12} className="mb-10">
        <Card className="w-full p-4 shadow-md">
          <IconCheckCircle className="mb-4 text-4xl text-green-500" />
          <h3 className="text-primary text-xl font-semibold">Total Attendance</h3>
          <p className="text-secondary text-3xl font-bold">{attendancePercentage}%</p>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <Card className="p-4 shadow-md">
          <IconClockCircle className="mb-4 text-4xl text-red-500" />
          <h3 className="text-primary text-xl font-semibold">Missed Classes</h3>
          <p className="text-secondary text-3xl font-bold">{missedClasses}</p>
        </Card>
      </Col>
    </Row>
  );
};

export default AttendanceCards;
