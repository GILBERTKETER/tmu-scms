import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Message } from "@arco-design/web-react";
import { IconEdit } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
const FormItem = Form.Item;

function EditUser({ email, role }) {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => {
    form.setFieldsValue({
      email: email,
      role: role,
    });
    setVisible(true);
  };

  const onOk = async () => {
    const values = form.getFieldsValue();
    setConfirmLoading(true);
    try {
      const response = await App.put(`/api/auth/update-user/`, values);
      if (response.data.success) {
        toast.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Updating Succeeded",
          text:
            response.data.message ||
            "You have successfully updated the user's information.",
        });
        setVisible(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Update failed",
          text:
            response.data.message || "There was an error updating the user.",
        });
        toast.error(`Failed to update the user: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while adding the user");
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: "There was an error adding the user.",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <IconEdit className="cursor-pointer" onClick={openModal} />
      <Modal
        title="Edit User"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <FormItem
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
          </FormItem>
          <FormItem
            label="Role"
            field="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="lecturer">Lecturer</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default EditUser; // Ensure the export matches the import in UserTable
