"use client";
import React, { useState, useEffect, forwardRef } from "react";
import {
  Table,
  Popconfirm,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
} from "@arco-design/web-react";
import { Resizable, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import { IconEdit, IconDelete } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

interface ColumnType {
  title: string;
  dataIndex: string;
  width?: number;
  render?: (value: any) => JSX.Element;
}

interface DataType {
  key: string;
  id: string; // Add id to the DataType
  title: string;
  status: string;
  date: string;
  severity: string;
}

const originColumns: ColumnType[] = [
  { title: "Title", dataIndex: "title", width: 120 },
  { title: "Status", dataIndex: "status", width: 100 },
  { title: "Date", dataIndex: "date", width: 150 },
  { title: "Severity", dataIndex: "severity" },
  { title: "Actions", dataIndex: "actions", width: 150 },
];

const CustomResizeHandle = forwardRef<HTMLSpanElement, { handleAxis: string }>(
  ({ handleAxis, ...restProps }, ref) => {
    return (
      <span
        ref={ref}
        className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
        {...restProps}
        onClick={(e) => e.stopPropagation()}
      />
    );
  },
);

const ResizableTitle: React.FC<
  ResizableTitleProps & React.HTMLAttributes<HTMLTableHeaderCellElement>
> = ({ onResize, width, ...restProps }) => {
  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={width}
      height={0}
      handle={<CustomResizeHandle handleAxis="e" />}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const IncidentTable: React.FC = () => {
  const [columns, setColumns] = useState(
    originColumns.map((column, index) => ({
      ...column,
      onHeaderCell: (col: ColumnType) =>
        col.width ? { width: col.width, onResize: handleResize(index) } : {},
      render:
        column.dataIndex === "status"
          ? (status: string) => (
              <span
                className={
                  status === "Active"
                    ? "font-bold text-red-500"
                    : "text-gray-500"
                }
              >
                {status}
              </span>
            )
          : column.dataIndex === "actions"
            ? (text: any, record: DataType) => (
                <div className="flex space-x-2">
                  <IconEdit onClick={() => handleEdit(record)} />
                  <Popconfirm
                    title="Are you sure you want to delete this incident?"
                    onOk={() => handleDelete(record.id)}
                  >
                    <IconDelete />
                  </Popconfirm>
                </div>
              )
            : undefined,
    })),
  );

  const [data, setData] = useState<DataType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedIncident, setEditedIncident] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Resolved", value: "Resolved" },
    { label: "Pending", value: "Pending" },
  ];

  const severityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await App.get("/api/get-all-incidents/");
        if (response.data && response.data.success) {
          const incidents = response.data.data.map((incident: any) => ({
            key: incident.id.toString(),
            id: incident.id.toString(), // Add id here
            title: incident.title,
            status: incident.status,
            date: incident.date,
            severity: incident.severity,
          }));
          setData(incidents);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  const handleEdit = (incident: DataType) => {
    setEditedIncident(incident);
    form.setFieldsValue({
      title: incident.title,
      status: incident.status,
      date: incident.date,
      severity: incident.severity,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await App.delete("/api/delete-incident/", {
        data: { id },
      });
      if (response.data.success) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        toast.success(response.data.message || "Incident deleted successfully!");
        Swal.fire({
          icon: "success",
          title: "Incident deleted",
          text: response.data.message || "The incident has been successfully deleted!",
        });
      } else {
        toast.error(response.data.message || "Incident failed to delete successfully!");
        Swal.fire({
          icon: "error",
          title: "Failed to delete incident.",
          text: response.data.message || "There was a problem deleting the incident!",
        });
      }
    } catch (error) {
      toast.error(error.message || "Incident failed to delete successfully!");
      Swal.fire({
        icon: "error",
        title: "Failed to delete incident.",
        text: error.message || "There was a problem deleting the incident!",
      });
    }
  };

  const handleResize =
    (index: number) =>
    (e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
      setColumns((prevColumns) => {
        const nextColumns = [...prevColumns];
        nextColumns[index] = { ...nextColumns[index], width: size.width };
        return nextColumns;
      });
    };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      const response = await App.put("/api/update-incident/", {
        id: editedIncident?.id, // Send the id along with the data
        ...values,
      });
      if (response.data.success) {
        setData((prevData) =>
          prevData.map((item) =>
            item.key === editedIncident?.key ? { ...item, ...values } : item,
          ),
        );
        toast.success(response.data.message || "Incident edited successfully!");
        Swal.fire({
          icon: "success",
          title: "Incident Updated",
          text: response.data.message || "The incident has been successfully updated!",
        });

        setModalVisible(false);
        setEditedIncident(null);
        form.resetFields();
      } else {
        toast.error(response.data.message || "Failed to edit incident!");
        Swal.fire({
          icon: "error",
          title: "Failed to edit incident",
          text: response.data.message || "There was a problem editing the incident!",
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to edit incident!");
      Swal.fire({
        icon: "error",
        title: "Failed to edit incident",
        text: error.message || "There was a problem editing the incident!",
      });
    }
  };

  const components = { header: { th: ResizableTitle } };

  return (
    <>
      <ToastContainer />
      <Table
        className="table-demo-resizable-column mb-10"
        components={components}
        border
        borderCell
        columns={columns}
        data={data}
      />

      <Modal
        title="Edit Incident"
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditedIncident(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            field="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            field="status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item
            label="Date"
            field="date"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Severity"
            field="severity"
            rules={[{ required: true, message: "Severity is required" }]}
          >
            <Select options={severityOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default IncidentTable;
