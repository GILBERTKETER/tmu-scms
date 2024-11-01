import {
  Modal,
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Tag,
} from "@arco-design/web-react";
import { useState, useEffect } from "react";
import App from "@/app/(site)/api/api";
import { toast } from "react-toastify";
interface AddEditClassModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  instructor: string;
  start_time: string;
  end_time: string;
  hall: string;
  date: string;
  recurring_days: string[];
}

const AddEditClassModal: React.FC<AddEditClassModalProps> = ({
  visible,
  onClose,
  onSave,
  instructor,
  start_time,
  end_time,
  hall,
  recurring_days,
}) => {
  const [form] = Form.useForm();
  const [instructors, setInstructors] = useState<
    { label: string; value: string }[]
  >([]);
  const [halls, setHalls] = useState<{ label: string; value: string }[]>([]);
  const recurringOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
        toast.error(error.message || "An unknown error occurred");
      }
    };

    fetchHalls();
    fetchInstructors();

    form.setFieldsValue({
      instructor,
      start_time,
      end_time,
      hall,
      recurring_days,
    });
  }, [instructor, start_time, end_time, hall, recurring_days, form]);

  const handleSave = () => {
    form.validate().then((values) => {
      onSave(values);
      onClose();
    });
  };

  return (
    <Modal visible={visible} onCancel={onClose} title="Edit Class Details">
      <Form form={form} layout="vertical">
        <Form.Item
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
        </Form.Item>

        <Form.Item
          label="Start Time"
          field="start_time"
          rules={[{ required: true, message: "Start time is required" }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="End Time"
          field="end_time"
          rules={[{ required: true, message: "End time is required" }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item label="Hall" field="hall" rules={[{ required: true }]}>
          <Select
            options={halls.map((hall) => ({
              label: `${hall.hall_name} ${hall.hall_number}`,
              value: `${hall.hall_name} ${hall.hall_number}`,
            }))}
            value={hall}
          />
        </Form.Item>

        <Form.Item
          label="Recurring Days"
          field="recurring_days"
          rules={[{ required: true, message: "Recurring days are required" }]}
        >
          <Select
            mode="multiple"
            options={recurringOptions.map((day) => ({
              label: day,
              value: day,
            }))}
            tagRender={(props) => <Tag color="blue">{props.label}</Tag>}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditClassModal;
