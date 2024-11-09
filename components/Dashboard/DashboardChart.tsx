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

const DashboardBarChart = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await App.get("/api/courses");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const fetchAttendanceData = async (courseCode) => {
    try {
      const response = await App.post("/api/get-attendance-data/", {
        course_code: courseCode,
      });
      if (response.data.success) {
        setAttendanceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    fetchAttendanceData(value);
  };

  return (
    <div className="flex h-full w-full flex-col">
     
    
      <Card title="Monthly Attendance Statistics" className="h-full w-full" extra={ <Select
        placeholder="Select a Course"
        value={selectedCourse}
        onChange={handleCourseChange}
        options={courses.map((course) => ({
          label: course.name + ' '+ course.course_code,
          value: course.course_code,
        }))}
        style={{ marginBottom: "20px", width: "200px" }}
      />}>
        <div style={{ height: "100% !important" }} className="h-[350px] w-full">
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
