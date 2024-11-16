"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Empty, Link, Tag } from "@arco-design/web-react";
import AddAnnouncements from "./AddAnnouncements";
import App from "@/app/(site)/api/api";
import { useAuth } from "@/context/Auth";

interface Announcement {
  title: string;
  content: string;
  datePosted: string;
}

interface ClassDetails {
  course_code: string;
  course_name: string;
}

interface AdminDetails {
  highest_attended?: {
    course_code: string;
    course_name: string;
    attendance_count: number;
  };
  least_attended?: {
    course_code: string;
    course_name: string;
    attendance_count: number;
  };
}

const ClasAndAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const { user } = useAuth();

  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);

  useEffect(() => {
    App.post("/api/get-classes/")
      .then((response) => {
        const data = response.data.data;
        if (user?.role.toLowerCase() === "admin") {
          setAdminDetails(data as AdminDetails);
        } else if (
          user?.role.toLowerCase() === "student" ||
          user?.role.toLowerCase() === "classrep" ||
          user?.role.toLowerCase() === "lecturer"
        ) {
          setClasses(data as ClassDetails[]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the classes:", error);
        setLoading(false);
      });
  }, [user?.role]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await App.get("/api/announcements");
        setAnnouncements(response.data.data as Announcement[]);
        if (response.data.data.length > 0) {
          setLatestAnnouncement(response.data.data[0] as Announcement);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-10 sm:flex-row lg:flex-row">
      <Card
        title={
          user?.role === "admin" || user?.role === "Admin"
            ? "A summary of attendance"
            : "Classes this Semester"
        }
        style={{
          width: "100%",
          height: "100% !important",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : user?.role.toLowerCase() === "admin" ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary">
                Highest Attended Course
              </h3>
              <p>
                Course:{" "}
                {adminDetails?.highest_attended?.course_code +
                  " " +
                  adminDetails?.highest_attended?.course_name}
                <br />
                Attendance Count:{" "}
                {adminDetails?.highest_attended?.attendance_count}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary">
                Least Attended Course
              </h3>
              <p>
                Course Code:{" "}
                {adminDetails?.least_attended?.course_code +
                  " " +
                  adminDetails?.least_attended?.course_name}
                <br />
                Attendance Count:{" "}
                {adminDetails?.least_attended?.attendance_count}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {classes.length > 0 ? (
              classes.map((course) => (
                <Tag key={course.course_code} color="blue">
                  {course.course_name} - {course.course_code}
                </Tag>
              ))
            ) : (
              <Empty
                imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
                description={<Button onClick={() => window.location.reload()} type="primary">Refresh</Button>}
              />
            )}
          </div>
        )}
      </Card>

      <Card
        title="Announcements"
        extra={
          (user?.role.toLowerCase() === "admin" ||
            user?.role.toLowerCase() === "lecturer") && <AddAnnouncements />
        }
        style={{
          width: "100%",
          height: "100% !important",
          position: "relative",
        }}
      >
        {latestAnnouncement ? (
          <div className="flex h-full w-full flex-col items-start justify-center">
            <h3 className="text-xl font-bold text-primary">
              {latestAnnouncement.title}
            </h3>
            <p className="text-sm font-bold text-secondary">
              {latestAnnouncement.content}
            </p>
            <p className="absolute bottom-0 right-5">
              <strong>Posted on:</strong>{" "}
              {new Date(latestAnnouncement.datePosted).toLocaleDateString()} at{" "}
              {new Date(latestAnnouncement.datePosted).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <Empty
            imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
            description={<Button type="primary" onClick={() => window.location.reload()}>Refresh</Button>}
          />
        )}
      </Card>
    </div>
  );
};

export default ClasAndAnnouncements;
