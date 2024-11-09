// components/ClassList.tsx

import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Spin } from "@arco-design/web-react";
import {
  IconEdit,
  IconDownload,
  IconQrcode,
} from "@arco-design/web-react/icon";
import QRCode from "react-qr-code";
import App from "@/app/(site)/api/api";
import StudentCheckInDrawer from "./StudentCheckInDrawer";
import { useAuth } from "@/context/Auth";
const ClassList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [classData, setClassData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null); // State to hold selected class details
  const qrCodeRef = useRef<HTMLDivElement>(null); // Ref to hold QR code container
  const { user } = useAuth();
  const fetchQrCode = async (classId: number) => {
    setLoading(true);
    try {
      const response = await App.post("/api/generate-qr/", { id: classId });
      if (response.data.success) {
        const qrSessionData = response.data.data;
        const qrCodeData = JSON.stringify({
          session: qrSessionData.session,
          schedule_id: qrSessionData.schedule_id,
          course_code: qrSessionData.course_code,
          course_name: qrSessionData.course_name,
          semester: qrSessionData.semester,
          year: qrSessionData.year,
          startTime: qrSessionData.startTime,
          endTime: qrSessionData.endTime,
          day: qrSessionData.day,
          hallId: qrSessionData.hallId,
          instructorId: qrSessionData.instructorId,
          courseId: qrSessionData.courseId,
          generated_at: qrSessionData.generated_at,
          expires_at: qrSessionData.expires_at,
        });
        setQrData(qrCodeData);
        setQrVisible(true);
      } else {
        console.error("Failed to generate QR code:", response.data.message);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await App.get("/api/get-scheduled-classes/");
        if (response.data.success) {
          setClassData(response.data.classes);
        } else {
          console.error("Failed to fetch classes:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const svg = qrCodeRef.current.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "qrcode.png";
        downloadLink.click();

        URL.revokeObjectURL(url);
      }
    }
  };

  const columns = [
    { title: "Course Name", dataIndex: "course_name" },
    { title: "Course Code", dataIndex: "course_code" },
    { title: "Program Name", dataIndex: "program_name" },
    { title: "Instructor Name", dataIndex: "instructor_name" },
    { title: "Hall Name", dataIndex: "hall_name" },
    { title: "Hall Number", dataIndex: "hall_number" },
    { title: "Date", dataIndex: "date" },
    { title: "Start Time", dataIndex: "time_start" },
    { title: "End Time", dataIndex: "time_end" },
    { title: "Recurring Days", dataIndex: "recurring_days" },
    {
      title: "Actions",
      render: (text: string, record: any) => (
        <>
          {user?.role == "student" ? null : (
            <>
              <Button type="text" onClick={() => fetchQrCode(record.id)}>
                <IconQrcode /> Generate QR
              </Button>
              <IconEdit onClick={() => handleEdit(record)} />
            </>
          )}
        </>
      ),
    },
  ];

  const handleEdit = (classItem: any) => {
    setSelectedClass(classItem); // Set selected class details
    setVisible(true); // Open the drawer
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedClass(null); // Clear selected class details when closing
  };

  return (
    <div>
      <Table
        style={{ width: "100%" }}
        columns={columns}
        data={classData}
        pagination={false}
        rowKey="id"
      />

      {/* QR Code Modal */}
      <Modal
        visible={qrVisible}
        title="Generated QR Code"
        onCancel={() => setQrVisible(false)}
        footer={
          <Button
            type="primary"
            icon={<IconDownload />}
            onClick={handleDownload}
          >
            Download QR Code
          </Button>
        }
      >
        {loading ? (
          <Spin />
        ) : qrData ? (
          <div
            ref={qrCodeRef}
            style={{
              background: "white",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <QRCode
              size={256}
              value={qrData}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>
        ) : (
          <p>Failed to load QR code.</p>
        )}
      </Modal>

      {/* Check-In Drawer */}
      {selectedClass && (
        <StudentCheckInDrawer
          visible={visible}
          onClose={handleClose}
          classItem={selectedClass} // Pass the full class item details
        />
      )}
    </div>
  );
};

export default ClassList;
