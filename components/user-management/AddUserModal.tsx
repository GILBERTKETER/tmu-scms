import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
} from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue(); 
      const response = await App.post("/api/auth/signup/", values); 

      if (response.data.success == true) {
        toast.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Registration Succeeded",
          text: response.data.message || "You have successfully added the user.",
        });
        form.resetFields();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: response.data.message || "There was an error adding the user.",
        });
        toast.error(`Failed to add user: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while adding the user");
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: "There was an error adding the user.",
      });
      console.error("Submit error:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal
        title="Add New User"
        visible={visible}
        onOk={handleSubmit}
        onCancel={onClose}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="First Name"
            field="firstName"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input placeholder="Enter user's first name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            field="lastName"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input placeholder="Enter user's last name" />
          </Form.Item>
          <Form.Item
            label="Email"
            field="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter user's email" />
          </Form.Item>
          <Form.Item
            label="Admission"
            field="admission"
            rules={[
              {
                required: true,
                message: "Please enter a valid admission",
              },
            ]}
          >
            <Input placeholder="Enter Admission or ID" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            field="phone"
            rules={[
              {
                required: true,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            label="Role"
            field="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="lecturer">Lecturer</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Password"
            field="password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input type="password" placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            field="cpassword"
            rules={[{ required: true, message: "Please confirm the password" }]}
          >
            <Input type="password" placeholder="Confirm the password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserModal;
