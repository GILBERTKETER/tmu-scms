import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Modal,
  Select,
  Input,
  Form,
} from "@arco-design/web-react";
import { IconSearch } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Facility {
  id: number;
  facility_name: string;
  capacity: number;
  facility_type: string;
  status: string;
}

interface Activity {
  id: number;
  activity_name: string;
  activity_start_time: string;
  activity_end_time: string;
  activity_date: string;
}

const FacilityList: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [form] = Form.useForm();

  const { Option } = Select;

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
      title: "Type",
      dataIndex: "facility_type",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Available" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  const handleBook = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedFacility(null);
  };

  const handleActivitySelect = (activityId: number) => {
    const activity = activities.find((act) => act.id === activityId) || null;
    setSelectedActivity(activity);
  };

  const handleBookingSubmit = async (values: any) => {
    if (!selectedFacility || !selectedActivity) return;

    const bookingData = {
      facility_id: selectedFacility.id,
      title: values.title,
      activity_id: values.activity,
      activity_start_time: selectedActivity.activity_start_time,
      activity_end_time: selectedActivity.activity_end_time,
      activity_date: selectedActivity.activity_date,
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
    const getActivities = async () => {
      const response = await App.get("/api/get-activities/");
      if (response.data.success) {
        setActivities(response.data.data);
      }
    };
    getActivities();
  }, []);

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
    const matchesType = filterType ? facility.facility_type === filterType : true;
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
          <Option value="Hall">Hall</Option>
          <Option value="Lab">Lab</Option>
          <Option value="Library">Library</Option>
        </Select>
      </div>
      <div className="facilities-table">


      <Table
      className="facilities-table-component"
        style={{ width: "100%" }}
        columns={columns}
        data={filteredFacilities}
        pagination={{ pageSize: 5 }}
        onRow={(record: Facility) => ({
          onClick: () => handleBook(record),
        })}
      />
      </div>


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
              rules={[
                { required: true, message: "Please enter a booking title" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Activity"
              field="activity"
              rules={[{ required: true, message: "Please select a facility." }]}
            >
              <Select onChange={handleActivitySelect}>
                {activities.map((activity) => (
                  <Option key={activity.id} value={activity.id}>
                    {activity.activity_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FacilityList;
