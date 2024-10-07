import React, { useState } from 'react';
import { Table, Tag, Modal, Button, Select, Input } from '@arco-design/web-react';
import { IconFilter, IconPlus, IconSearch } from '@arco-design/web-react/icon';

const FacilityList: React.FC = () => {
  const [filterType, setFilterType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilities = [
    { key: 1, name: 'Main Hall', capacity: 500, status: 'Available' },
    { key: 2, name: 'Computer Lab 1', capacity: 50, status: 'Booked' },
    { key: 3, name: 'Physics Lab', capacity: 30, status: 'Available' },
    { key: 4, name: 'Library 1', capacity: 200, status: 'Booked' },
  ];

  const columns = [
    {
      title: 'Facility',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'Available' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
   
  ];

  const handleBook = (facility) => {
    setSelectedFacility(facility); // Set the selected facility details
    setIsModalVisible(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedFacility(null); // Reset selected facility
  };

  return (
    <div className='w-full'>
      <div className="mb-4 gap-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        <Input
          prefix={<IconSearch />}
          placeholder="Search facility"
          value={searchText}
          onChange={(value) => setSearchText(value)}
          style={{ width: '100%' }}
        />
        <Select
          placeholder="Filter by Type"
          value={filterType}
          onChange={setFilterType}
          style={{ width: '100%' }}
        >
          <Select.Option value="Hall">Hall</Select.Option>
          <Select.Option value="Lab">Lab</Select.Option>
          <Select.Option value="Library">Library</Select.Option>
        </Select>
      </div>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={facilities}
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => handleBook(record),
        })}
      />

      {/* Modal for booking the facility */}
      <Modal
        title={`Book Facility: ${selectedFacility?.name}`}
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        okText="Submit Booking"
        cancelText="Cancel"
      >
        {selectedFacility && (
          <div>
            <p><strong>Facility Name:</strong> {selectedFacility.name}</p>
            <p><strong>Capacity:</strong> {selectedFacility.capacity}</p>
            <p><strong>Status:</strong> {selectedFacility.status}</p>
            {/* Add form fields for booking here */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacilityList;
