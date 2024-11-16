import { useState, useEffect } from 'react';
import { List, Avatar, Popconfirm, Message } from '@arco-design/web-react';
import { IconEdit, IconDelete } from '@arco-design/web-react/icon';
import App from "@/app/(site)/api/api"; // Ensure this path is correct for your setup
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EnrolledCourse {
  course__code: string;
  course__name: string;
  year: number;
  semester: string;
}

function EnrolledCourses() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      try {
        const response = await App.get<{ success: boolean; enrolled_courses: EnrolledCourse[] }>('/api/get-enrolled-courses/');

        if (response.data.success) {
          setEnrolledCourses(response.data.enrolled_courses);
        } 
      } catch (error: any) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const de_enrollCourse = async (courseCode: string) => {
    try {
      const response = await App.post<{ success: boolean; message: string }>("/api/de-enroll-course/", { courseCode });
      if (response.data.success) {
        toast.success("Course discarded successfully!");
        Swal.fire({
          icon: "success",
          title: "Discarding Succeeded",
          text: response.data.message || "You have successfully discarded the course.",
        });
      } else {
        toast.error("Discard failed: " + response.data.message);
        Swal.fire({
          icon: "error",
          title: "Discard Failed",
          text: response.data.message || "There was a problem discarding the course. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error("Error discarding the course: " + error.message);
      Swal.fire({
        icon: "error",
        title: "Discarding Failed",
        text: "There was a problem discarding the course. Please try again.",
      });
    }
  };

  const render = (actions: React.ReactNode[], item: EnrolledCourse, index: number) => (
    <List.Item key={index} actions={actions}>
      <List.Item.Meta
        avatar={<Avatar shape='square'>C</Avatar>}
        title={`${item.course__name} (${item.course__code})`}
        description={`Year: ${item.year}, Semester: ${item.semester}`}
      />
    </List.Item>
  );

  return (
    <>
      <List
        className='list-demo-actions'
        style={{ width: "100%", marginBottom: 48 }}
        loading={loading}
        dataSource={enrolledCourses}
        render={(item, index) => render([
          <span className='list-demo-actions-icon' key="delete-icon">
            <Popconfirm
              focusLock
              title='Confirm'
              content='Are you sure you want to discard the course?'
              onOk={() => de_enrollCourse(item.course__code)} 
              onCancel={() => {
                Message.error({
                  content: 'Canceled the process',
                });
              }}
            >
              <IconDelete />
            </Popconfirm>
          </span>,
        ], item, index)} // Pass item and index correctly
      />
      <ToastContainer />
    </>
  );
}

export default EnrolledCourses;