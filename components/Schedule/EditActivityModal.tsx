import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Message,
  TimePicker,
} from "@arco-design/web-react";
import {
  IconCalendar,
  IconEdit,
  IconInfoCircle,
} from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const FormItem = Form.Item;

interface EditActivityModalProps {
  id: number;
  activity_name: string;
  activity_start_time: string;
  activity_end_time: string;
  activity_location: string;
  activity_date: string;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  id,
  activity_name,
  activity_start_time,
  activity_end_time,
  activity_location,
  activity_date,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validate();
      const { activity_name, activity_date, activity_location, timeRange } =
        values;

      setConfirmLoading(true);
      const response = await App.put(`/api/update-activity/`, {
        id,
        activity_name,
        activity_date,
        activity_location,
        time_range: timeRange,
      });

      if (response.data.success) {
        setVisible(false);
        toast.success(
          response.data.message || "Activity updated successfully!",
        );
        Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: response.data.message || "Activity updated successfully.",
        });
      } else {
        setVisible(false);
        toast.error(
          response.data.message ||
            "There was a problem updating our records. Please try again.",
        );
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            response.data.message ||
            "There was a problem updating the activity. Please try again.",
        });
      }
    } catch (error: any) {
      setVisible(false);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was a problem updating the activity. Please try again.",
      });
      toast.error(
        "Failed to update activity: " + (error.message || "Unknown error."),
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <div>
      <ToastContainer/>
      <IconEdit className="cursor-pointer" onClick={() => setVisible(true)} />
      <Modal
        title={`Edit ${activity_name}`}
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{
            id,
            activity_name,
            activity_date,
            activity_location,
            timeRange: [activity_start_time, activity_end_time],
          }}
        >
          <FormItem label="ID" field="id" rules={[{ required: true }]}>
            <Input defaultValue={id.toString()} hidden />
          </FormItem>
          <FormItem
            label="Activity Name"
            field="activity_name"
            rules={[{ required: true }]}
          >
            <Input defaultValue={activity_name} />
          </FormItem>
          <FormItem
            label="Activity Date"
            field="activity_date"
            rules={[{ required: true }]}
          >
            <Input defaultValue={activity_date} />
          </FormItem>
          <FormItem
            label="Activity Location"
            field="activity_location"
            rules={[{ required: true }]}
          >
            <Input defaultValue={activity_location} />
          </FormItem>
          <FormItem
            label="Time Range"
            field="timeRange"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker
              prefix={<IconInfoCircle />}
              style={{ width: 250 }}
              defaultValue={[activity_start_time, activity_end_time]}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default EditActivityModal;
