import { Select, Input, Button } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import App from "@/app/(site)/api/api";
import { useAuth } from "@/context/Auth";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
const RfidCheckIn: React.FC = () => {
  const [rfid, setRfid] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<{
    course_code: string;
    course_name: string;
    hallId: string;
    recurring_days: string;
  } | null>(null);
  const [courses, setCourses] = useState<
    {
      id: number;
      course_code: string;
      course_name: string;
      hallId: string;
      recurring_days: string;
    }[]
  >([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await App.get("/api/get-scheduled-classes/");
        if (response.data.success) {
          setCourses(response.data.classes);
        } else {
          console.error("Failed to fetch courses:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelect = (id: number) => {
    setScheduleId(id.toString());
    const course = courses.find((course) => course.id === id);
    if (course) {
      setSelectedCourse({
        course_code: course.course_code,
        course_name: course.course_name,
        hallId: course.hallId,
        recurring_days: course.recurring_days,
      });
    }
  };

  const handleRfidSubmit = async () => {
    if (!selectedCourse) {
      console.error("No course selected");
      return;
    }

    try {
      const response = await App.post("/api/check-in-students/rfid/", {
        rfid,
        schedule_id: scheduleId,
        course_code: selectedCourse.course_code,
        course_name: selectedCourse.course_name,
        hall_id: selectedCourse.hallId,
        recurring_days: selectedCourse.recurring_days,
        user_id: user?.id,
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
          response.data.message || "Failed to check you in!",
        );
        Swal.fire({
          icon: "error",
          title: "Failed to check-in",
          text:
            response.data.message ||
            "There was a problem checking you in.",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while checking-in .";
      toast.error(errorMessage || "Failed to check you in!");
      Swal.fire({
        icon: "error",
        title: "Failed to check-in.",
        text: errorMessage || "There was a problem checking-in.",
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Select
        value={scheduleId}
        onChange={(value) => handleCourseSelect(Number(value))}
        placeholder="Select course"
        className="mb-10"
      >
        {courses.map((course) => (
          <Select.Option key={course.id} value={course.id}>
            {`${course.course_name} (${course.course_code})`}
          </Select.Option>
        ))}
      </Select>

      {selectedCourse && (
        <>
          <Input
            hidden
            value={selectedCourse.course_code}
            readOnly
            className="mb-10"
            placeholder="Course Code"
          />
          <Input
            hidden
            value={selectedCourse.course_name}
            readOnly
            className="mb-10"
            placeholder="Course Name"
          />
          <Input
            hidden
            value={selectedCourse.hallId}
            readOnly
            className="mb-10"
            placeholder="Course Hall"
          />
          <Input
            hidden
            value={selectedCourse.recurring_days}
            readOnly
            className="mb-10"
            placeholder="Day"
          />
        </>
      )}

      <Input
        value={rfid}
        onChange={(e) => setRfid(e)}
        placeholder="Enter RFID code"
        className="mb-10"
      />

      <Button type="primary" onClick={handleRfidSubmit} className="mt-4">
        Submit
      </Button>
    </div>
  );
};

export default RfidCheckIn;
