import React, { useEffect, useState } from "react";
import { Drawer, Checkbox, Button } from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
interface Student {
  user_id: number;
  first_name: string;
}

interface StudentCheckInDrawerProps {
  visible: boolean;
  onClose: () => void;
  classItem: any;
}

const StudentCheckInDrawer: React.FC<StudentCheckInDrawerProps> = ({
  visible,
  onClose,
  classItem,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [checkedInStudents, setCheckedInStudents] = useState<number[]>([]);

  const handleCheckboxChange = (studentId: number) => {
    setCheckedInStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  useEffect(() => {
    if (visible) {
      const fetchStudents = async (course_id: string, scheduleId: string) => {
        console.log("class item:", classItem);
        try {
          const response = await App.post("/api/get-enrollments-by-course/", {
            params: { course_id, scheduleId },
          });
          setStudents(response.data.enrollments);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
      fetchStudents(classItem.course_id, classItem.id);
    }
  }, [visible]);

  const handleCheckIn = async () => {
    try {
      const response = await App.post("/api/check-in-students/", {
        class_id: classItem.course_id,
        course_name: classItem.course_name,
        course_code: classItem.course_code,
        hallId: classItem.hallId,
        EndTime: classItem.time_end,
        StartTime: classItem.time_start,
        day: classItem.recurring_days,
        ScheduleId: classItem.id,

        student_ids: checkedInStudents,
      });
      if (response.data.success) {
        toast.success(response.data.message || "Check-in was successfully!");
        Swal.fire({
          icon: "success",
          title: "Checked in",
          text: response.data.message || "The check-in was sucessfull.",
        });
      } else {
        toast.error(
          response.data.message || "Failed to check-in the sselected students!",
        );
        Swal.fire({
          icon: "error",
          title: "Failed to check-in",
          text:
            response.data.message ||
            "There was a problem checking the students in.",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while checking-in the students.";
      toast.error(errorMessage || "Failed to check the students in!");
      Swal.fire({
        icon: "error",
        title: "Failed to check-in the students.",
        text: errorMessage || "There was a problem checking-in the students.",
      });
    }
    onClose();
  };

  return (
    <>
      <ToastContainer />
      <Drawer
        width={332}
        title={<span>Check-In for {classItem?.course_name || ""}</span>}
        visible={visible}
        onOk={handleCheckIn}
        onCancel={onClose}
        closable={true}
      >
        <div>
          {students.map((student) => (
            <div key={student.user_id}>
              <Checkbox onChange={() => handleCheckboxChange(student.user_id)}>
                {student.first_name}
              </Checkbox>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default StudentCheckInDrawer;
