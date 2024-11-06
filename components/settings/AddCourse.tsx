import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { toast } from "react-toastify";
import App from "@/app/(site)/api/api";

import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormItem = Form.Item;

interface Program {
  id: number;
  name: string;
}

function AddCourse() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [programs, setPrograms] = useState<Program[]>([]); 

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await App.get("/api/programs/");
        if (response.status !== 200) {
          toast.error("An error occurred while fetching programs.");
          throw new Error("Failed to fetch programs");
        }

        setPrograms(response.data);
      } catch (error:any) {
        toast.error(
          error.message || "An error occurred while fetching programs.",
        );
      }
    };

    fetchPrograms();
  }, []);

  async function onOk() {
    try {
      const values = await form.validate();

      setConfirmLoading(true);

      const courseData = {
        code: values.code,
        name: values.name,
        description: values.description,
        program: values.program,
        semester: values.semester,
        year: values.year
      };

      const response = await App.post("/api/add-course/", courseData);

      if (response.data.success) {
        toast.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Submission Successfull",
          text:
            response.data.message || "The course has successfully been added!",
        });
        form.resetFields();
        return;
      } else {
        toast.error("An error occurred while adding the course.");
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            response.data.message ||
            "There was a problem submitting the course. Please try again.",
        });
        throw new Error("Failed to add course");
      }
    } catch (error:any) {
      toast.error(
        error.message || "An error occurred while adding the course.",
      );
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem submitting the course. Please try again.",
      });
    } finally {
      setVisible(false);
      setConfirmLoading(false);
    }
  }

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  return (
    <div>
      <ToastContainer />
      <Button
        onClick={() => setVisible(true)}
        type="primary"
        icon={<IconPlus />}
      >
        Add Course
      </Button>

      <Modal
        title="Add Course"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...formItemLayout}
          form={form}
          labelCol={{
            style: { flexBasis: 90 },
          }}
          wrapperCol={{
            style: { flexBasis: "calc(100% - 90px)" },
          }}
        >
          <FormItem
            label="Course Code"
            field="code"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter course code" />
          </FormItem>
          <FormItem
            label="Course Name"
            field="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter course name eg CCS, MMA" />
          </FormItem>
          <FormItem label="Description" field="description">
            <Input.TextArea placeholder="Enter course description" rows={3} />
          </FormItem>
          <FormItem
            label="Program"
            field="program"
            required
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a program"
              options={programs.map((program) => ({
                value: program.id, 
                label: program.name, 
              }))}
            />
          </FormItem>
          <FormItem
            label="Year"
            field="year"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter course year eg 1,2,3,4" />
          </FormItem>
          <FormItem
            label="Semester"
            field="semester"
            required
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select semester"
              options={[
                { value: "1", label: "First Semester" },
                { value: "2", label: "Second Semester" },
              ]}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default AddCourse;
