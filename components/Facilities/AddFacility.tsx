import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
} from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const FormItem = Form.Item;

function AddFacility() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      await form.validate();

      const values = await form.getFieldsValue(); 
      console.log("Form values before sending:", values);
      setConfirmLoading(true);

      const response = await App.post("/api/add-facility/", values);

      if (!response.data.success) {
        throw new Error(response.data.message || "Submission failed");
      }

      toast.success(response.data.message);
      Swal.fire({
        icon: "success",
        title: "Succeeded",
        text: response.data.message,
      });

      setVisible(false);
      form.resetFields();
    } catch (error:any) {
      toast.error(error.message || "There was a problem submitting your facility. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "There was a problem submitting your facility. Please try again.",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

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
      <Button onClick={() => setVisible(true)} type="primary">
        Add Facility
      </Button>
      <Modal
        title="Add Facility"
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
            label="Facility Name"
            field="name"
            rules={[{ required: true, message: "Please enter the facility name" }]}
          >
            <Input placeholder="Enter facility name e.g., Laboratory" />
          </FormItem>
          <FormItem
            label="Capacity"
            field="capacity"
            rules={[{ required: true, message: "Please enter the facility capacity" }]}
          >
            <Input type="number" placeholder="Enter the facility capacity" />
          </FormItem>
          <FormItem
            label="Type"
            field="type"
            rules={[{ required: true, message: "Please fill in the facility type" }]}
          >
            <Select placeholder="Select facility type">
              <Select.Option value="physics_lab">Physics Lab</Select.Option>
              <Select.Option value="biology_lab">Biology Lab</Select.Option>
              <Select.Option value="computer_lab">Computer Lab</Select.Option>
              <Select.Option value="library">Library</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default AddFacility;
