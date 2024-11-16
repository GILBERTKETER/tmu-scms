import { useState } from "react";
import { Modal, Button, Form, Input, Message } from "@arco-design/web-react";
const FormItem = Form.Item;
import { useAuth } from "@/context/Auth";
import { toast, ToastContainer } from "react-toastify";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
function ChangePhone() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  async function onOk() {
    try {
      const values = await form.validate();
      setConfirmLoading(true);

      const response = await App.post("/api/auth/change-phone/", {
          currentEmail: user?.email,
          phoneNumber: values.phone,
        
      });

      if (response.data.success == true) {
        Swal.fire({
          icon: "success",
          title: "Phone number Updated",
          text:
            response.data.message ||
            "Your phone number has been successfully updated!",
        });

        toast.success(
          response.data.message || "Phone number updated successfully!",
        );
        setVisible(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message ||
            "Failed to update phone number. Please try again.",
        });

        toast.error(
          response.data.message ||
            "Failed to update phone number. Please try again.",
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed to update phone number. Please try again.",
      });

      toast.error(
          "Failed to update phone number. Please try again.",
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
        title="Change Phone Number"
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
            label="Phone Number"
            field="phone"
            rules={[
              { required: true, message: "Please enter phone number." },
              { type: "number", message: "Please enter a valid phone number" },
            ]}
          >
            <Input placeholder="New Phone Number" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default ChangePhone;
