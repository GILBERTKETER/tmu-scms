import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Input, Select } from "@arco-design/web-react";
import App from "@/app/(site)/api/api"; 

// Define the structure of each row in the table
interface Course {
  key: string;
  code: string;
  course: string;
  program: string; 
}

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    fixed: "left" as const,
  },
  {
    title: "Course",
    dataIndex: "course",
  },
  {
    title: "Operation",
    dataIndex: "operation",
    render: (_, record: Course) => (
      <Button type="primary" size="mini" onClick={() => enrollCourse(record.key)}>
        Enroll
      </Button>
    ),
    fixed: "right" as const,
    width: 100,
  },
];

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredData, setFilteredData] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await App.get<Course[]>("/api/get-courses/"); // Adjust the endpoint
        setCourses(response.data);
        setFilteredData(response.data); // Set initial filtered data
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
  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);

    const filtered = courses.filter((item) => 
      item.program === program || program === "" // Allow all if no program is selected
    );

    setFilteredData(filtered);
  };

  // Enrollment function
  const enrollCourse = async (courseId: string) => {
    try {
      // Call your API to enroll the course
      const response = await App.post("/api/enroll-course/", { courseId });
      if (response.data.success) {
        // Handle successful enrollment (e.g., show a toast notification)
        console.log("Enrolled successfully:", response.data.message);
      } else {
        console.error("Enrollment failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error enrolling course:", error);
    }
  };

  return (
    <div className="shadow-lg bg-gray-50">
      {/* Program filter dropdown */}
      <Select
        placeholder="Select Program"
        style={{ width: 300, marginBottom: 20 }}
        onChange={handleProgramChange}
        allowClear
      >
        <Select.Option value="">All Programs</Select.Option>
        <Select.Option value="Computer Science">Computer Science</Select.Option>
        <Select.Option value="Business Administration">Business Administration</Select.Option>
        <Select.Option value="Engineering">Engineering</Select.Option>
        {/* Add more program options as needed */}
      </Select>

      {/* Filter input */}
      <Input.Search
        placeholder="Filter by Code"
        value={searchTerm}
        onChange={handleSearch} // value is directly passed here
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
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row></Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default Courses;
