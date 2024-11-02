import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Modal,
  Button,
  Select,
  Input,
  DatePicker,
  Form,
  Time,
  TimePicker,
} from "@arco-design/web-react";
import { IconInfoCircle, IconSearch } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacilityList: React.FC = () => {
  const [filterType, setFilterType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Facility",
      dataIndex: "facility_name",
      sorter: true,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Available" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  const handleBook = (facility) => {
    setSelectedFacility(facility);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedFacility(null);
  };

  const handleBookingSubmit = async (values) => {
    const bookingData = {
      facility_id: selectedFacility.id,
      title: values.title,
      date: values.date,
      start_time: values.time[0],
      end_time: values.time[1],
    };

    try {
      const response = await App.post("/api/facility-booking/", bookingData);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Successful",
          text: response.data.message || "Facility booked successfully!",
        });
        toast.success(response.data.message || "Facility booked successfully!");
        handleModalClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: response.data.message || "There was a problem with the booking.",
        });
        toast.error(response.data.message || "Error occurred while booking!");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "An error occurred while processing your booking. Please try again.",
      });
      toast.error("An error occurred while processing your booking. Please try again.");
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await App.get("/api/get-all-facilities/");
        if (response.data.success) {
          setFacilities(response.data.facilities);
        } else {
          console.error("Failed to fetch facilities:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredFacilities = facilities.filter((facility) => {
    const matchesType = filterType ? facility.type === filterType : true;
    const matchesSearch = facility.facility_name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2">
        <Input
          prefix={<IconSearch />}
          placeholder="Search facility"
          value={searchText}
          onChange={(value) => setSearchText(value)}
          style={{ width: "100%" }}
        />
        <Select
          placeholder="Filter by Type"
          value={filterType}
          onChange={setFilterType}
          style={{ width: "100%" }}
        >
          <Select.Option value="Hall">Hall</Select.Option>
          <Select.Option value="Lab">Lab</Select.Option>
          <Select.Option value="Library">Library</Select.Option>
        </Select>
      </div>
      <Table
        style={{ width: "100%" }}
        columns={columns}
        data={filteredFacilities}
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => handleBook(record),
        })}
      />

      <Modal
        title={`Book Facility: ${selectedFacility?.facility_name}`}
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={handleModalClose}
        okText="Submit Booking"
        cancelText="Cancel"
      >
        {selectedFacility && (
          <Form form={form} onSubmit={handleBookingSubmit}>
          
            <Form.Item
              label="Facility Name"
              initialValue={selectedFacility.facility_name}
              field="facility_name"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Capacity"
              initialValue={selectedFacility.capacity}
              field="capacity"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Status"
              initialValue={selectedFacility.status}
              field="status"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Booking Title"
              field="title"
              rules={[{ required: true, message: 'Please enter a booking title' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Booking Date"
              field="date"
              rules={[{ required: true, message: 'Please select a booking date' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Time Range"
              field="time"
              rules={[{ required: true, message: 'Please select a time range' }]}
            >
      <TimePicker.RangePicker prefix={<IconInfoCircle/>} style={{ width: 250, }} />
      </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FacilityList;
