"use client";
import React, { useEffect, useState } from "react";
import { Card, Select } from "@arco-design/web-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import App from "@/app/(site)/api/api";

interface Course {
  name: string;
  course_code: string;
}

interface AttendanceData {
  month: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: AttendanceData[];
  courses: Course[];
}

const DashboardBarChart: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      try {
        const response = await App.get<ApiResponse>("/api/courses");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const fetchAttendanceData = async (courseCode: string): Promise<void> => {
    try {
      const response = await App.post<ApiResponse>(
        "/api/get-attendance-data/",
        {
          course_code: courseCode,
        },
      );
      if (response.data.success) {
        setAttendanceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleCourseChange = (value: string): void => {
    setSelectedCourse(value);
    fetchAttendanceData(value);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Card
        title="Monthly Attendance Statistics"
        className="h-full w-full"
        extra={
         
        }
      >
      <Select
            placeholder="Select a Course"
            value={selectedCourse}
            onChange={handleCourseChange}
            options={courses.map((course) => ({
              label: `${course.name} ${course.course_code}`,
              value: course.course_code,
            }))}
            style={{ marginBottom: "20px", width: "200px" }}
          />
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#22409a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardBarChart;
