import { useState } from "react";
import { Modal, Button, Form, Input, Message } from "@arco-design/web-react";
const FormItem = Form.Item;
import { useAuth } from "@/context/Auth";
import { toast, ToastContainer } from "react-toastify";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
function ChangeEmail() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  async function onOk() {
    try {
      const values = await form.validate();
      setConfirmLoading(true);

      const response = await App.post("/api/auth/change-email/", {
          currentEmail: user?.email,
          newEmail: values.email,
        
      });

      if (response.data.success == true) {
        Swal.fire({
          icon: "success",
          title: "Email address Updated",
          text:
            response.data.message ||
            "Your Email has been successfully updated!",
        });

        toast.success(
          response.data.message || "Email updated successfully!",
        );
        setVisible(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message ||
            "Failed to update email. Please try again.",
        });

        toast.error(
          response.data.message ||
            "Failed to update email. Please try again.",
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed to update email. Please try again.",
      });

      toast.error(
          "Failed to update email. Please try again.",
      );
    } finally {
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
      <ToastContainer/>
      <p
        className="cursor-pointer font-semibold text-blue-600 underline decoration-2"
        onClick={() => setVisible(true)}
      >
        Change
      </p>
      <Modal
        title="Change Email"
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
            label="Email Address"
            field="email"
            rules={[
              { required: true, message: "Please enter an email address." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input type="email" placeholder="New Email" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default ChangeEmail;
