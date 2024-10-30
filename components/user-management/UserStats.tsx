import React, { useEffect, useState } from "react";
import { Card, Grid, Statistic } from "@arco-design/web-react";
import { IconUser, IconUserGroup } from "@arco-design/web-react/icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "@/app/(site)/api/api";

const UserStats: React.FC = () => {
  const [recordsCount, setRecordsCount] = useState<any>(null);
  const { Row, Col } = Grid;

  useEffect(() => {
    const count_users = async () => {
      try {
        const response = await App.get("/api/auth/get-users-count/");
        if (response.data.success === false) {
          toast.error(
            response.data.message || "There was an error getting the records.",
          );
        } else {
          setRecordsCount(response.data.data);
        }
      } catch (error) {
        toast.error("An error occurred on our end. We apologize.");
      }
    };
    count_users();
  }, []);

  return (
    <>
      <ToastContainer />
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              styleValue={{ color: "#22409a" }}
              title="Total Students"
              value={recordsCount?.students || 0}
              prefix={
                <IconUser
                  style={{ color: "#fcb815" }}
                  fontSize={32}
                  strokeWidth={4}
                />
              }
              suffix="students"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              styleValue={{ color: "#22409a" }}
              title="Total Staff"
              value={recordsCount?.admins || 0}
              prefix={
                <IconUserGroup
                  style={{ color: "#fcb815" }}
                  fontSize={32}
                  strokeWidth={4}
                />
              }
              suffix="staff"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              styleValue={{ color: "#22409a" }}
              title="Class Reps"
              value={recordsCount?.class_reps || 0}
              prefix={
                <IconUser
                  style={{ color: "#fcb815" }}
                  fontSize={32}
                  strokeWidth={4}
                />
              }
              suffix="students"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              styleValue={{ color: "#22409a" }}
              title="Lecturers"
              value={recordsCount?.lecturers || 0}
              prefix={
                <IconUserGroup
                  style={{ color: "#fcb815" }}
                  fontSize={32}
                  strokeWidth={4}
                />
              }
              suffix="lecturers"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserStats;
