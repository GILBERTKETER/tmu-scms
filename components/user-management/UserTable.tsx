import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Message, Popconfirm } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconSearch } from '@arco-design/web-react/icon';
import EditUser from "./EditUser"

const UserTable: React.FC = () => {
  const [filterRole, setFilterRole] = useState('');
  const [searchText, setSearchText] = useState('');
 
  // Sample data for users
  const originalData = [
    { key: 1, name: 'John Doe', role: 'student' },
    { key: 2, name: 'Jane Smith',role: 'lecturer' },
    { key: 3, name: 'Paul Adams', role: 'admin' },
    { key: 4, name: 'Alice Johnson',  role: 'student' },
    { key: 5, name: 'Michael Brown', role: 'lecturer' },
  ];

  // Filter data based on search and role filter
  const filteredData = originalData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesRole = filterRole ? item.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      filters: [
        { text: 'Student', value: 'student' },
        { text: 'Lecturer', value: 'lecturer' },
        { text: 'Admin', value: 'admin' },
      ],
      onFilter: (value, record) => record.role.includes(value),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Space>
        <EditUser/>
        <Popconfirm
        focusLock
        title='Confirm'
        content='Are you sure you want to delete?'
        onOk={() => handleDeleteUser(record.id)}
        onCancel={() => {
          Message.error({
            content: 'cancel',
          });
        }}

      >
          <IconDelete className='cursor-pointer' />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditUser = (id) => {
    // Handle editing user
  };

  const handleDeleteUser = (id) => {
    // Handle deleting user
  };

  return (
    <div>
      <Space  style={{ width:"100%", marginBottom: 16 }}>
        <Input
          prefix={<IconSearch />}
          placeholder="Name or Email"
          value={searchText}
          onChange={setSearchText}  // Fixed: set the search text directly
          style={{ width: "100%" }}
        />
        <Select
          placeholder="Filter by role"
          value={filterRole}
          onChange={setFilterRole}
          style={{ width: "100%" }}
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="student">Student</Select.Option>
          <Select.Option value="lecturer">Lecturer</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      </Space> 
      <Table columns={columns} data={filteredData} pagination={{ pageSize: 5 }} rowKey="key" />
    </div>
  );
};

export default UserTable;
