import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Modal,
  Button,
  Select,
  Input,
} from "@arco-design/web-react";
import { IconFilter, IconPlus, IconSearch } from "@arco-design/web-react/icon";
import App from "@/app/(site)/api/api";

const FacilityList: React.FC = () => {
  const [filterType, setFilterType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedFacility(null);
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
        onOk={handleModalClose}
        onCancel={handleModalClose}
        okText="Submit Booking"
        cancelText="Cancel"
      >
        {selectedFacility && (
          <div>
            <p>
              <strong>Facility Name:</strong> {selectedFacility.facility_name}
            </p>
            <p>
              <strong>Capacity:</strong> {selectedFacility.capacity}
            </p>
            <p>
              <strong>Status:</strong> {selectedFacility.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacilityList;
