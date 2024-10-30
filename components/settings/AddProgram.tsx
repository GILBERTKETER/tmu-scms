import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { toast } from "react-toastify";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormItem = Form.Item;

function AddProgram() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  async function onOk() {
    try {
      const values = await form.validate();

      setConfirmLoading(true);

      const programData = {
        name: values.name,
        description: values.description,
       
      };

      const response = await App.post("/api/add-program/", programData);

      if (response.data.success) {
        toast.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Submission Successful",
          text: response.data.message || "The program has successfully been added!",
        });
        form.resetFields();
      } else {
        toast.error("An error occurred while adding the program.");
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: response.data.message || "There was a problem submitting the program. Please try again.",
        });
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding the program.");
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem submitting the program. Please try again.",
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
        Add Program
      </Button>

      <Modal
        title="Add Program"
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
            label="Program Name"
            field="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter program name" />
          </FormItem>
          <FormItem label="Description" field="description">
            <Input.TextArea placeholder="Enter program description" rows={3} />
          </FormItem>
          
          
        </Form>
      </Modal>
    </div>
  );
}

export default AddProgram;
