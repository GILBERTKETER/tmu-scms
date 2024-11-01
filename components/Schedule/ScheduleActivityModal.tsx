import { useState } from "react";
import {
  Drawer,
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Message,
} from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FormItem = Form.Item;

function ActivityDrawer() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      const response = await App.post("/api/add-activity/", values);
      if (response.data.success == true) {
        toast.success(response.data.message || "Activity added successfully");
        Swal.fire({
          icon: "success",
          title: "Activity Submitted successfully",
          text: response.data.message,
        });
        setVisible(false);
      } else {
        toast.error(response.data.message || "Adding activity failed.");
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            response.data.message ||
            "There was a problem submitting your activity. Please try again.",
        });
        setVisible(false);
      }

      form.resetFields();
    } catch (error) {
      setVisible(false);
      toast.error("Adding activity failed.");
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem submitting your activity. Please try again.",
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Button onClick={() => setVisible(true)} type="primary">
        Add Activity
      </Button>
      <Drawer
        width={332}
        title={<span>Schedule an Activity</span>}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <FormItem
            label="Activity Name"
            field="activity_name"
            rules={[
              { required: true, message: "Please enter the activity name" },
            ]}
          >
            <Input placeholder="Enter activity name" />
          </FormItem>
          <FormItem
            label="Description"
            field="activity_description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea placeholder="Enter activity description" />
          </FormItem>
          <FormItem
            label="Date"
            field="activity_date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </FormItem>
          <FormItem
            label="Start Time"
            field="activity_start_time"
            rules={[{ required: true, message: "Please select a start time" }]}
          >
            <TimePicker style={{ width: "100%" }} />
          </FormItem>
          <FormItem
            label="End Time"
            field="activity_end_time"
            rules={[{ required: true, message: "Please select an end time" }]}
          >
            <TimePicker style={{ width: "100%" }} />
          </FormItem>
          <FormItem
            label="Location"
            field="activity_location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Input placeholder="Enter activity location" />
          </FormItem>
        </Form>
      </Drawer>
    </div>
  );
}

export default ActivityDrawer;
