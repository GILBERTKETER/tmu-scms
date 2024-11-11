import React, { useState } from "react";
import { Modal, Button, Select, Message } from "@arco-design/web-react";
import { useAuth } from "@/context/Auth";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";

function EditDetails() {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");

  const semesters = [
    { label: "Semester 1", value: "1" },
    { label: "Semester 2", value: "2" },
  ];

  const years = Array.from({ length: 4 }, (_, i) => ({
    label: `Year ${i + 1}`,
    value: `${i + 1}`,
  }));

  const handleOk = async () => {
    if (!semester || (user?.role === "student" && !year)) {
      Message.error("All fields are required.");
      return;
    }

    try {
      const response = await App.put("/api/auth/edit-details/", {
        semester,
        year,
      });
      if (response.data.success == true) {
        toast.success(
          response.data.message ||
            "Your details have been updated successfully.",
        );
        setVisible(false);
      } else {
        toast.error(
          response.data.message || "There was a problem updating your details.",
        );
      }
    } catch (error: any) {
    } finally {
      setVisible(false);
    }
  };

  return (
    <div>
        <ToastContainer/>
      <Button onClick={() => setVisible(true)} type="primary">
        Update My Details
      </Button>
      <Modal
        title="Edit your details if necessary"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ marginBottom: 16 }}>
          <Select
            placeholder="Select Semester"
            value={semester}
            onChange={setSemester}
            options={semesters}
            style={{ width: "100%" }}
          />
        </div>

        {user?.role === "student" ||
          (user?.role === "classrep" && (
            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Year of Study"
                value={year}
                onChange={setYear}
                options={years}
                style={{ width: "100%" }}
              />
            </div>
          ))}
      </Modal>
    </div>
  );
}

export default EditDetails;
