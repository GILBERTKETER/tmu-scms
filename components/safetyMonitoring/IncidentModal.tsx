import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Message,
  DatePicker,
} from "@arco-design/web-react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import App from "@/app/(site)/api/api";

const FormItem = Form.Item;

function AddIncidentModal() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  async function onSubmit() {
    try {
      const formData = await form.validate();
      setConfirmLoading(true);

      const response = await App.post("/api/add-incident/", formData);

      if (response.data.success == true) {
        toast.success(response.data.message || "Incident added successfully!");
        Swal.fire({
          icon: "success",
          title: "Incident Added",
          text:
            response.data.message ||
            "The incident has been successfully added to the monitoring system!",
        });

        setVisible(false);
        form.resetFields();
      } else {
        toast.error(response.data.message || "Failed to add incident!");
        Swal.fire({
          icon: "error",
          title: "Failed to add incident",
          text:
            response.data.message ||
            "There was a problem adding the incident to the monitoring system!",
        });
      }
    } catch (error) {
      // Check if error response is available for better error handling
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while adding the incident";
      toast.error(errorMessage || "Failed to add incident!");
      Swal.fire({
        icon: "error",
        title: "Failed to add incident",
        text:
          errorMessage ||
          "There was a problem adding the incident to the monitoring system!",
      });
    } finally {
      setConfirmLoading(false);
    }
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  return (
    <div>
      <ToastContainer/>
      <Button onClick={() => setVisible(true)} type="primary">
        Add Incident
      </Button>
      <Modal
        title="Add Incident to the Monitoring System"
        visible={visible}
        onOk={onSubmit}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...formItemLayout}
          form={form}
          labelCol={{ style: { flexBasis: 100 } }}
          wrapperCol={{ style: { flexBasis: "calc(100% - 100px)" } }}
        >
          <FormItem
            label="Title"
            field="title"
            rules={[
              { required: true, message: "Please enter the incident title" },
            ]}
          >
            <Input placeholder="Enter incident title" />
          </FormItem>

          <FormItem
            label="Description"
            field="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea placeholder="Enter incident description" />
          </FormItem>

          <FormItem
            label="Status"
            field="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { label: "Active", value: "active" },
                { label: "Resolved", value: "resolved" },
                { label: "Pending", value: "pending" },
              ]}
            />
          </FormItem>

          <FormItem
            label="Severity"
            field="severity"
            rules={[
              { required: true, message: "Please select a severity level" },
            ]}
          >
            <Select
              placeholder="Select severity level"
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
            />
          </FormItem>

          <FormItem
            label="Date"
            field="date"
            rules={[
              { required: true, message: "Please select the incident date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default AddIncidentModal;
