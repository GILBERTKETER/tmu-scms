import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  TimePicker,
  DatePicker,
  Switch,
} from "@arco-design/web-react";
import { IconCalendar, IconInfoCircle } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FormItem = Form.Item;

interface ScheduledClassesProps {
  course_name: string;
  course_code: string;
  course_id: number;
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({
  course_name,
  course_code,
  course_id,
}) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [halls, setHalls] = useState<{ id: number; hall_name: string }[]>([]);
  const [instructors, setInstructors] = useState<
    { id: number; name: string }[]
  >([]);
  const [isRecurring, setIsRecurring] = useState(false);

  const daysOfWeek = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await App.get("/api/get-halls/");
        setHalls(response.data);
      } catch (error) {
        console.error("Error fetching halls:", error);
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await App.get("/api/get-instructors/");
        setInstructors(response.data.data);
      } catch (error) {
        toast.error(error.message || "An unknown error occured");
      }
    };

    fetchHalls();
    fetchInstructors();
  }, []);

  const onOk = async () => {
    try {
      const values = await form.validate();
      setConfirmLoading(true);

      const payload = {
        course_id: course_id,
        instructor_id: values.instructor,
        hall: values.hall,
        date: isRecurring ? null : values.date,
        time_start: values.time_Range[0],
        time_end: values.time_Range[1],
        recurring_days: isRecurring ? values.daysOfWeek : null,
      };

      const response = await App.post("/api/add-schedule/", payload);
      if (response.data.success == true) {
        toast.success(response.data.message || "Class scheduled successfully");
        Swal.fire({
          icon: "success",
          title: "Class scheduled successfully",
          text: response.data.message,
        });
        setVisible(false);
      } else {
        toast.error(response.data.message || "Scheduling class failed.");
        Swal.fire({
          icon: "error",
          title: "Schedule Failed",
          text:
            response.data.message ||
            "There was a problem scheduling your class. Please try again.",
        });
        setVisible(false);
      }
    } catch (error) {
      toast.error(error.message || "An error occured.");
      Swal.fire({
        icon: "error",
        title: "Schedlule Failed",
        text:
          error.message ||
          "There was a problem scheduling your class. Please try again.",
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
      <Button
        type="primary"
        icon={<IconCalendar />}
        onClick={() => setVisible(true)}
      >
        Schedule Class
      </Button>
      <Modal
        title={`Schedule ${course_name} ${course_code} Class`}
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{
            id: course_id,
            code: course_code,
            hall: halls.length > 0 ? halls[0].id : undefined,
            instructor: instructors.length > 0 ? instructors[0].id : undefined,
          }}
        >
          <FormItem label="Course ID" field="id" rules={[{ required: true }]}>
            <Input readOnly />
          </FormItem>
          <FormItem
            label="Course Code"
            field="code"
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </FormItem>
          <FormItem label="Hall" field="hall" rules={[{ required: true }]}>
            <Select
              options={halls.map((hall) => ({
                label: hall.hall_name + " " + hall.hall_number,
                value: hall.id,
              }))}
            />
          </FormItem>
          <FormItem
            label="Instructor"
            field="instructor"
            rules={[{ required: true }]}
          >
            <Select
              options={instructors.map((inst) => ({
                label: inst.name,
                value: inst.id,
              }))}
            />
          </FormItem>
          <FormItem label="Recurring" field="isRecurring">
            <Switch checked={isRecurring} onChange={setIsRecurring} />
          </FormItem>

          {isRecurring ? (
            <FormItem
              label="Days of Week"
              field="daysOfWeek"
              rules={[
                {
                  required: true,
                  message: "Please select days for recurring schedule.",
                },
              ]}
            >
              <Select
                mode="multiple"
                options={daysOfWeek}
                placeholder="Select days"
              />
            </FormItem>
          ) : (
            <FormItem
              label="Date"
              field="date"
              rules={[
                {
                  required: true,
                  message: "Please select a date for the class.",
                },
              ]}
            >
              <DatePicker placeholder="Select date" />
            </FormItem>
          )}

          <FormItem
            label="Time Range"
            field="time_Range"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker
              prefix={<IconInfoCircle />}
              style={{ width: 250 }}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduledClasses;
