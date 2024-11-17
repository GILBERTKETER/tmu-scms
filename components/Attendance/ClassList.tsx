import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Spin, Tooltip, Input } from "@arco-design/web-react";
import {
  IconEdit,
  IconDownload,
  IconQrcode,
  IconPlus,
} from "@arco-design/web-react/icon";
import QRCode from "react-qr-code";
import App from "@/app/(site)/api/api";
import StudentCheckInDrawer from "./StudentCheckInDrawer";
import { useAuth } from "@/context/Auth";
import { toast, ToastContainer } from "react-toastify";
import "./styles.css"
const ClassList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [rfidVisible, setRfidVisible] = useState(false);
  const [newRfid, setNewRfid] = useState("");
  const [classData, setClassData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
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
        toast.error("Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Error generating QR code");
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
          toast.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        toast.error("Error fetching class data");
      }
    };

    fetchClasses();
  }, []);

  const handleOpenRfidModal = (classId: number) => {
    setSelectedClassId(classId);
    setRfidVisible(true);
  };

  const handleAddRfid = async () => {
    if (!selectedClassId || !newRfid.trim()) {
      toast.error("Please enter an RFID value");
      return;
    }

    try {
      const response = await App.put("/api/update-rfid/", {
        id: selectedClassId,
        rfid: newRfid.trim(),
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setRfidVisible(false);
        setNewRfid("");
        setSelectedClassId(null);

        // Refresh the class data after successful update
        const updatedResponse = await App.get("/api/get-scheduled-classes/");
        if (updatedResponse.data.success) {
          setClassData(updatedResponse.data.classes);
        }
      } else {
        toast.error(response.data.message || "AN error occured.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while updating RFID");
    }
  };

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
      render: (_: string, record: any) => (
        <>
          {user?.role === "student" ? null : (
            <div className="flex items-center gap-2">
              <Button type="text" onClick={() => fetchQrCode(record.id)}>
                <IconQrcode /> Generate QR
              </Button>
              <Tooltip
                style={{ cursor: "pointer" }}
                color="blue"
                content="Manual Checkin"
              >
                <IconEdit onClick={() => handleEdit(record)} />
              </Tooltip>
              {user?.role === "lecturer" && (
                <Tooltip
                  style={{ cursor: "pointer" }}
                  color="blue"
                  content="Add RFID For your students"
                >
                  <IconPlus onClick={() => handleOpenRfidModal(record.course_id)} />
                </Tooltip>
              )}
            </div>
          )}
        </>
      ),
    },
  ];

  const handleEdit = (classItem: any) => {
    setSelectedClass(classItem);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedClass(null);
  };

  return (
    <div>
      <ToastContainer />
      <div className="responsive-container">
        <Table
          columns={columns}
          data={classData}
          pagination={true}
          rowKey="id"
          className="responsive-table"
        />
      </div>




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
          classItem={selectedClass}
        />
      )}

      {/* RFID Modal */}
      <Modal
        title="Set New RFID for your class"
        visible={rfidVisible}
        onOk={handleAddRfid}
        onCancel={() => {
          setRfidVisible(false);
          setNewRfid("");
          setSelectedClassId(null);
        }}
        autoFocus={false}
        focusLock={true}
      >
        <Input
          placeholder="Enter the new RFID (number or string)"
          value={newRfid}
          onChange={(value) => setNewRfid(value)}
        />
      </Modal>
    </div>
  );
};

export default ClassList;