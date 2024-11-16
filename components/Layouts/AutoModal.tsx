import React, { useEffect, useState } from "react";
import { Modal, Select, Message } from "@arco-design/web-react";
import { useAuth } from "@/context/Auth";
import App from "@/app/(site)/api/api";

// Define types for program and option objects
interface ProgramOption {
  label: string;
  value: string;
}

const semesters = [
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
];

const years = Array.from({ length: 4 }, (_, i) => ({
  label: `Year ${i + 1}`,
  value: `${i + 1}`,
}));

const AutoModal = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState<boolean>(false);
  const [program, setProgram] = useState<string>("");  // Type as string
  const [semester, setSemester] = useState<string>("");  // Type as string
  const [yearOfStudy, setYearOfStudy] = useState<string>("");  // Type as string
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);  // Type as array of ProgramOption objects
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await App.get("/api/programs/");
        const programs = response.data.map((program: { name: string, id: string }) => ({
          label: program.name,
          value: program.id,
        }));
        setProgramOptions(programs);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    if (
      user &&
      !user?.program &&
      user?.role !== "admin" &&
      user?.role !== "lecturer"
    ) {
      setVisible(true);
    }
  }, [user]);

  const handleOk = async () => {
    setLoading(true);
    try {
      // Send data to the API
      const response = await App.post("/api/auth/complete-user-details/", {
        program,
        semester,
        yearOfStudy,
      });
      if (response.data.success === true) {
        // Close modal on success
        setVisible(false);
        Message.success(
          response.data.message || "Profile updated successfully!"
        );
      } else {
        setVisible(true);
        Message.error(
          response.data.message || "Failed to save. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to save user details:", error);
      Message.error("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Complete Your Profile"
      visible={visible}
      onOk={handleOk}
      autoFocus={false}
      focusLock={true}
      confirmLoading={loading}
      footer={null} // Remove default footer
    >
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Program"
          value={program}
          onChange={setProgram}
          options={programOptions}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Semester"
          value={semester}
          onChange={setSemester}
          options={semesters}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Year of Study"
          value={yearOfStudy}
          onChange={setYearOfStudy}
          options={years}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ textAlign: "right" }}>
        <button onClick={handleOk} disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
};

export default AutoModal;
