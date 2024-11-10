"use client";
import React, { useEffect, useState } from "react";
import { Card, Select, Button, Empty } from "@arco-design/web-react";
import DashboardBarChart from "./DashboardChart";
import App from "@/app/(site)/api/api"; // Adjust based on your API configuration
import { useAuth } from "@/context/Auth";
import Link from "next/link";

const InfoAndChart = () => {
  const [latestIncident, setLatestIncident] = useState(null);
  const [latestLog, setLatestLog] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedsemester, setSelectedSemester] = useState(null);
  const { user } = useAuth();

  // Fetch latest active incident
  useEffect(() => {
    const fetchLatestIncident = async () => {
      try {
        const response = await App.get("/api/latest-active-incident");
        if (response.data.success) {
          setLatestIncident(response.data.data);
        } else {
          setLatestIncident(null);
        }
      } catch (error) {
        console.error("Error fetching latest active incident:", error);
      }
    };
    fetchLatestIncident();
  }, []);

  // Fetch the latest log based on user role
  useEffect(() => {
    const fetchLatestLog = async () => {
      try {
        const response = await App.get("/api/latest-log");
        if (response.data.success) {
          setLatestLog(response.data.data);
        } else {
          setLatestLog(null);
        }
      } catch (error) {
        console.error("Error fetching latest log:", error);
      }
    };

    // Only fetch latest log if the user is a student or lecturer
    if (user?.role === "student" || user?.role === "classrep") {
      fetchLatestLog();
    }
  }, [user]);

  // Fetch courses for admins to download attendance
  useEffect(() => {
    if (
      user?.role === "admin" ||
      user?.role === "Admin" ||
      user?.role === "lecturer" ||
      user?.role === "Lecturer"
    ) {
      const fetchCourses = async () => {
        try {
          const response = await App.get("/api/get-courses/admins/");
          if (response.data.success == true) {
            setCourses(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchCourses();
    }
  }, [user]);

  // Handle attendance download
  const handleDownloadAttendance = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    try {
      const response = await App.post(`/api/download-attendance/`, {
        responseType: "blob",
        data: { selectedCourse, selectedsemester, selectedYear },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Attendance_${selectedCourse}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading attendance:", error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-10 lg:flex-row">
      <div className="flex h-full w-full flex-col gap-4 lg:w-1/4">
        <Card
          title="Latest Active Incident"
          extra={<Link href="/smartcampus/safety-monitoring">Learn more</Link>}
          style={{
            width: "100%",
            maxWidth: "50% !important",
            height: "50% !important",
          }}
        >
          {latestIncident ? (
            <div className="relative flex w-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-primary">Title</p>
                  <p className="text-xs text-black">{latestIncident.title}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-primary">Description</p>
                  <p className="text-xs text-black">
                    {latestIncident.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-primary">Severity</p>
                  <p className="text-xs text-black">
                    {" "}
                    {latestIncident.severity}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-primary">Status</p>
                  <p className="text-xs text-black"> {latestIncident.status}</p>
                </div>
              </div>
              <p className=" text-sm font-bold text-primary">
                <strong>Reported on:</strong>{" "}
                {new Date(latestIncident.report_date).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <Empty
              imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
              description={<Button onClick={()=>window.location.reload()} type="primary">Refresh</Button>}
            />
          )}
        </Card>

        <Card
          title={`${user?.role === "admin" || user?.role === "Admin" || user?.role === "lecturer" || user?.role === "Lecturer" ? "Attendance downloads" : "Latest log"}`}
          style={{
            width: "100%",
            maxWidth: "50% !important",
            height: "50% !important",
            minHeight: "50% !important",
          }}
        >
          {user?.role === "admin" ||
          user?.role === "Admin" ||
          user?.role === "lecturer" ||
          user?.role === "Lecturer" ? (
            <div>
              <Select
                placeholder="Select course"
                style={{ width: "100%", marginBottom: "10px" }}
                onChange={(value) => setSelectedCourse(value)}
                options={courses.map((course) => ({
                  label: course.name + " " + course.code,
                  value: course.id,
                }))}
              />
              <Select
                placeholder="Select Year"
                style={{ width: "100%", marginBottom: "10px" }}
                onChange={(value) => setSelectedYear(value)}
                options={[
                  { label: "Year 1", value: 1 },
                  { label: "Year 2", value: 2 },
                  { label: "Year 3", value: 3 },
                  { label: "Year 4", value: 4 },
                ]}
              />
              <Select
                placeholder="Select Semester"
                style={{ width: "100%", marginBottom: "10px" }}
                onChange={(value) => setSelectedSemester(value)}
                options={[
                  { label: "Semester 1", value: 1 },
                  { label: "Semester 2", value: 2 },
                ]}
              />
              <Button type="primary" onClick={handleDownloadAttendance}>
                Download Attendance
              </Button>
            </div>
          ) : latestLog ? (
            <div className="flex flex-col gap-4">
              <h3>
                <strong className="text-primary">Course: </strong>
                {latestLog.course}
              </h3>
              <p>
                <strong className="text-primary">Used: </strong>
                {latestLog.method + " method."}
              </p>
              <p>
                <strong className="text-primary">Timestamp:</strong>{" "}
                {new Date(latestLog.timestamp).toLocaleString()}
              </p>
            </div>
          ) : (
            <Empty
              imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
              description={<Button onClick={()=>window.location.reload()} type="primary">Refresh</Button>}
            />
          )}
        </Card>
      </div>

      <div className="h-full w-full lg:w-3/4">
        <DashboardBarChart />
      </div>
    </div>
  );
};

export default InfoAndChart;
