import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Message,
  Select,
  Popconfirm,
} from "@arco-design/web-react";
import { IconDelete, IconEdit } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormItem = Form.Item;

interface Hall {
  id: number;
  hall_name: string;
  hall_capacity: number;
  booked: "Available" | "Occupied"; // Adjusted to match the Select values
  hall_number: string;
}

const HallManagement: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch halls from backend API
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await App.get<Hall[]>("/api/get-halls/");
        setHalls(response.data);
      } catch (error) {
        console.error("Error fetching halls:", error);
        Message.error("Failed to fetch halls");
      }
    };

    fetchHalls();
  }, []);

  const deleteHall = async (id: number) => {
    try {
      const response = await App.delete(`/api/delete-hall/`, {
        data: { id },
      });
      if (response.data.success) {
        setHalls(halls.filter((hall) => hall.id !== id));
        toast.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Hall Deleted",
          text: response.data.message,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the hall.");
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "There was a problem deleting the hall. Please try again.",
      });
    }
  };

  const columns = [
    { title: "Hall Number", dataIndex: "hall_number" },
    { title: "Hall Name", dataIndex: "hall_name" },
    { title: "Capacity", dataIndex: "hall_capacity" },
    { title: "Status", dataIndex: "booked" },
    {
      title: "Action",
      render: (_, record: Hall) => (
        <div className="flex items-center justify-between gap-10">
          <IconEdit
            className="cursor-pointer text-primary"
            onClick={() => showModal(record)}
          />
          <Popconfirm
            focusLock
            title="Confirm"
            content="Are you sure you want to delete?"
            onOk={() => deleteHall(record.id)}
            onCancel={() => {
              Message.error({
                content: "Deletion Canceled",
              });
            }}
          >
            <IconDelete className="cursor-pointer text-primary" />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const showModal = (record: Hall) => {
    form.setFieldsValue({
      ...record,
      booked: record.booked === "Occupied" ? "True" : "False",
    });
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validate();
      // Update the hall details on the backend
      const response = await App.put(`/api/update-hall/`, values);
      // Check if the request was successful
      if (response.data.success === false) {
        toast.error(response.data.message);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            response.data.message ||
            "There was a problem updating the hall. Please try again.",
        });
        return;
      }

      // Show success notifications
      Swal.fire({
        icon: "success",
        title: "Hall Updated",
        text: response.data.message,
      });
      toast.success(response.data.message);
      // Update the local state
      setHalls(
        halls.map((h) => (h.id === values.id ? { ...h, ...values } : h)),
      );
      setVisible(false);
    } catch (error) {
      toast.error("An error occurred while updating the details.");
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem updating the hall. Please try again.",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: "20px", width: "100%" }}>
        <Table columns={columns} data={halls} />
        <Modal
          title="Edit Hall"
          visible={visible}
          onOk={handleOk}
          onCancel={() => setVisible(false)}
        >
          <Form form={form} layout="vertical">
            <FormItem field="id" hidden>
              <Input />
            </FormItem>
            <FormItem
              label="Hall Name"
              field="hall_name"
              rules={[{ required: true }]}
            >
              <Input />
            </FormItem>
            <FormItem
              label="Hall Number"
              field="hall_number"
              rules={[{ required: true }]}
            >
              <Input />
            </FormItem>
            <FormItem
              label="Capacity"
              field="hall_capacity"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} />
            </FormItem>
            <FormItem
              label="Status"
              field="booked"
              rules={[{ required: true }]}
            >
              <Select placeholder="Availability">
                <Select.Option value="Occupied">Occupied</Select.Option>
                <Select.Option value="Available">Available</Select.Option>
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default HallManagement;
