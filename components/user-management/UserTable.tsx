import React, { useState, useEffect } from "react";
import { Table, Input, Select, Space, Popconfirm, Message } from "@arco-design/web-react";
import { IconDelete, IconSearch } from "@arco-design/web-react/icon";
import EditUser from "./EditUser"; // Ensure correct naming
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "@/app/(site)/api/api";
interface userTypes{
  full_name:string;
  role:string;
}
const UserTable: React.FC = () => {
  const [filterRole, setFilterRole] = useState("");
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<userTypes[]>([]);

  useEffect(() => {
    const get_all_users = async () => {
      try {
        const response = await App.get("/api/auth/get-all-users/");
        if (!response.data.success) {
          toast.error(response.data.message);
        }
        setUsers(response.data.data);
      } catch (error:any) {
        toast.error("An error occurred: " + error.message);
      }
    };
    get_all_users();
  }, []);

  const filteredData = users.filter((item) => {
    const matchesSearch = item.full_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole ? item.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        { text: "Student", value: "student" },
        { text: "Lecturer", value: "lecturer" },
        { text: "Admin", value: "admin" },
      ],
      onFilter: (value:any, record:any) => record.role.includes(value),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_:any, record:any) => (
        <Space>
          <EditUser email={record.email} role={record.role} />
          <Popconfirm
            focusLock
            title="Confirm"
            content="Are you sure you want to delete?"
            onOk={() => handleDeleteUser(record.id)}
            onCancel={() => {
              Message.error({
                content: "cancel",
              });
            }}
          >
            <IconDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeleteUser = (id:string) => {
    // Handle deleting user
  };

  return (
    <div>
      <ToastContainer />
      <Space style={{ width: "100%", marginBottom: 16 }}>
        <Input
          prefix={<IconSearch />}
          placeholder="Search by name"
          value={searchText}
          onChange={(value) => setSearchText(value)}
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
      <Table
        columns={columns}
        data={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />
    </div>
  );
};

export default UserTable;
