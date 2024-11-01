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
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
interface AddEditClassModalProps {
  visible: boolean;
  onClose: () => void;
  instructor: string;
  start_time: string;
  end_time: string;
  hall: string;
  date: string;
  recurring_days: string[];
  id: string;
}

const AddEditClassModal: React.FC<AddEditClassModalProps> = ({
  visible,
  onClose,
  instructor,
  start_time,
  end_time,
  hall,
  recurring_days,
  id,
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
      id,
    });
  }, [instructor, start_time, end_time, hall, recurring_days, form, id]);

  const handleSave = () => {
    form
      .validate()
      .then(async (values) => {
        try {
          const response = await App.post("/api/update-class-details/", values);
          if (response.data.success == true) {
            Swal.fire({
              icon: "success",
              title: "Updated successfully",
              text: response.data.message || "Schedule updated successfully.",
            });
            toast.success(response.data.message || "Class details saved successfully!");
            // onClose();
          } else {
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: response.data.message || "There was a problem updating the schedule. Please try again.",
            });
            toast.error(response.data.message || "Error occurred while saving the updates!");
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was a problem updating the schedule. Please try again.",
          });
          toast.error("Failed to save class details. Please try again.");
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "There was a problem updating the schedule. Please try again.",
        });
        toast.error("Please fill all required fields correctly.");
      });
  };
  

  return (
    <>
      <ToastContainer />
      <Modal
        visible={visible}
        onCancel={onClose}
        onOk={handleSave}
        title="Edit Class Details"
      >
        <Form form={form} layout="vertical">
          <Form.Item field="id" rules={[{ required: true }]}>
            <Input readOnly hidden />
          </Form.Item>
          <Form.Item
            label="Instructor"
            field="instructor_id"
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

          <Form.Item label="Hall" field="hall_id" rules={[{ required: true }]}>
            <Select
              options={halls.map((hall) => ({
                label: `${hall.hall_name} ${hall.hall_number}`,
                value: `${hall.id}`,
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
    </>
  );
};

export default AddEditClassModal;
