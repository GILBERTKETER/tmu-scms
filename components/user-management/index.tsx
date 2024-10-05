"use client"; // Ensure this is at the top if you're using Next.js

import React, { useState } from 'react';
import { Table, Input, Modal, Button, Select, Pagination, Notification, Tag, Message, Popconfirm } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconSearch } from '@arco-design/web-react/icon';
import EditUser from "./EditUser";

const { Option } = Select;

// Dummy users list
const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@smartcampus.edu', role: 'student', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@smartcampus.edu', role: 'admin', status: 'inactive' },
  { id: 3, name: 'Charlie Doe', email: 'charlie@smartcampus.edu', role: 'staff', status: 'active' },
  { id: 4, name: 'Diana Blake', email: 'diana@smartcampus.edu', role: 'student', status: 'inactive' },
  { id: 5, name: 'Eve Thomson', email: 'eve@smartcampus.edu', role: 'admin', status: 'active' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(dummyUsers); // Use dummy data
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterRole, setFilterRole] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<any | null>(null); // User to edit in modal

  // Filter and search users based on criteria
  const filteredUsers = users.filter(user => {
    return (
      (filterRole ? user.role === filterRole : true) &&
      (searchKeyword ? user.name.toLowerCase().includes(searchKeyword.toLowerCase()) : true)
    );
  });

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // Handle role filter
  const handleRoleChange = (value: string) => {
    setFilterRole(value);
  };

  // Open edit modal with user details
  const handleEditUser = (user: any) => {
    setEditUser(user);
    setModalVisible(true);
  };

  // Handle user deletion
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    Notification.success({
      title: 'User Deleted',
      content: `User ${id} has been deleted successfully`,
    });
  };

  // Handle bulk actions (activate or deactivate users)
  const handleBulkAction = (action: 'activate' | 'deactivate') => {
    const updatedUsers = users.map(user =>
      selectedUsers.includes(user.id)
        ? { ...user, status: action === 'activate' ? 'active' : 'inactive' }
        : user
    );
    setUsers(updatedUsers);
    Notification.success({
      title: 'Bulk Action Completed',
      content: `Selected users were successfully ${action}d`,
    });
    setSelectedUsers([]);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: string) => <Tag color={role === 'admin' ? 'red' : 'green'}>{role.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => <Tag color={status === 'active' ? 'blue' : 'gray'}>{status.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <>
          <div className="cursor-pointer flex items-center justify-between gap-2">
            <EditUser />
            <Popconfirm
              focusLock
              title="Confirm"
              content="Are you sure you want to delete?"
              onOk={() => handleDeleteUser(record.id)}
              onCancel={() => {
                Message.error({
                  content: 'Cancel',
                });
              }}
            >
              <Button className="cursor-pointer" icon={<IconDelete color="red" />} />
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg w-full" style={{ overflowX: 'auto', border: '2px solid red' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">User Management</h1>
        <div className="flex space-x-4">
          <Input placeholder="Search users..." prefix={<IconSearch />} onChange={handleSearch} />
          <Select placeholder="Filter by role" onChange={handleRoleChange}>
            <Option value="admin">Admin</Option>
            <Option value="student">Student</Option>
            <Option value="staff">Staff</Option>
          </Select>
        </div>
      </div>
      <Table
        columns={columns}
        data={filteredUsers}
        rowSelection={{
          selectedRowKeys: selectedUsers,
          onChange: setSelectedUsers,
        }}
        pagination={false}
        scroll={{
            x: 500,
            y: 400,
          }}      />
      <div className="mt-4 flex justify-between items-center">
        <Button type="primary" onClick={() => handleBulkAction('activate')} disabled={selectedUsers.length === 0}>
          Activate Selected
        </Button>
        <Pagination total={filteredUsers.length} current={currentPage} onChange={(page) => setCurrentPage(page)} />
        <Button onClick={() => handleBulkAction('deactivate')} disabled={selectedUsers.length === 0}>
          Deactivate Selected
        </Button>
      </div>
    </div>
  );
};

export default UserManagement;
