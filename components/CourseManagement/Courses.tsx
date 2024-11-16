import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Input, Select, Message, Popconfirm } from "@arco-design/web-react";
import App from "@/app/(site)/api/api"; 
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

interface Course {
  key: string;
  code: string;
  name: string;
  program__name: string; 
}



interface Program {
  id: string;
  name: string;
}
 // Enrollment function
 const enrollCourse = async (courseId: string) => {
  try {
    const response = await App.post("/api/enroll-course/", { courseId });
    if (response.data.success) {
      toast.success("Enrolled successfully!");
      Swal.fire({
        icon: "success",
        title: "Enrollment Succeded",
        text:
          response.data.message ||
          "You have successfully enrolled to the course.",
      });
    } else {
      toast.error("Enrollment failed: " + response.data.message);
      Swal.fire({
        icon: "error",
        title: "Enrollement Failed",
        text:
          response.data.message ||
          "There was a problem enrolling on the course. Please try again.",
      });
    }
  } catch (error:any) {
    toast.error("Error enrolling course: " + error.message);
    Swal.fire({
      icon: "error",
      title: "Enrollement Failed",
      text:
        "There was a problem enrolling on the course. Please try again.",
    });
  }
};
const columns = [
  {
    title: "Code",
    dataIndex: "code",
    fixed: "left" as const,
  },
  {
    title: "Course",
    dataIndex: "name",
  },
  {
    title: "Operation",
    dataIndex: "operation",
    render: (_:any, record: Course) => (
      <Popconfirm
      focusLock
      title='Confirm'
      content='Are you sure you want to Enroll?'
      onOk={() => enrollCourse(record.code)}
      onCancel={() => {
        Message.error({
          content: 'Canceld the process',
        });
      }}

    >
      <Button type="primary" size="mini" >
        Enroll
      </Button>
      </Popconfirm>
    ),
    fixed: "right" as const,
    width: 100,
  },
];

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredData, setFilteredData] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [program, setSelectedProgram] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await App.get<{ data: Course[] }>("/api/get-courses/");
        setCourses(response.data.data);
        setFilteredData(response.data.data); 
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  
    const filtered = courses.filter((item) =>
      item.code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle program filter change
  const handleProgramChange = (program__name: string) => {
    setSelectedProgram(program__name);

    const filtered = courses.filter((item) => 
      item.program__name === program__name || program__name === "" 
    );

    setFilteredData(filtered);
  };


 

  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await App.get("/api/programs/");
        if (response.status === 200 ) {
          setPrograms(response.data); 
        } else {
          toast.error("An error occurred while fetching programs.");
        }
      } catch (error:any) {
        toast.error(error.message || "An error occurred while fetching programs.");
      }
    };

    fetchPrograms();
  }, []);

  return (
    <>
    <ToastContainer/>
    <div className="shadow-lg bg-gray-50">
      {/* Program filter dropdown */}
      <Select
          placeholder="Select Program"
          style={{ width: 300, marginBottom: 20 }}
          onChange={handleProgramChange}
          allowClear
        >
          <Option value="">All Programs</Option>
          {programs.map((program) => (
            <Option key={program.id} value={program.name}>
              {program.name}
            </Option>
          ))}
        </Select>

      {/* Filter input */}
      <Input.Search
        placeholder="Filter by Code"
        value={searchTerm}
        onChange={handleSearch} 
        allowClear
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Table */}
      <Table
        style={{
          marginTop: 20,
        }}
        columns={columns}
        data={filteredData}
        scroll={{
          x: 300,
        }}
        border={{
          wrapper: true,
          cell: true,
        }}
      />
    </div>
    </>

  );
};

export default Courses;
