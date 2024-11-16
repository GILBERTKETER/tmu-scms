import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Message } from "@arco-design/web-react";
import { IconSearch } from "@arco-design/web-react/icon";
import { ColumnProps } from "@arco-design/web-react/es/Table/interface";
import App from "@/app/(site)/api/api";
import { RefInputType } from "@arco-design/web-react/es/Input/interface";

type AdminData = {
  key: number;
  name: string;
  department: string;
  email: string;
};

type APIAdmin = {
  full_name: string;
  program: string;
  email: string;
};

type APIResponse = {
  success: boolean;
  message?: string;
  data: APIAdmin[];
};

const Admins = (): JSX.Element => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<RefInputType | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const { data } = await App.get<APIResponse>(
          "/api/auth/get-all-admins/",
        );
        if (data.success) {
          const adminData = data.data.map((admin, index) => ({
            key: index + 1,
            name: admin.full_name,
            department: admin.program,
            email: admin.email,
          }));
          setAdmins(adminData);
        } else {
          Message.error(data.message || "Failed to fetch admin data");
        }
      } catch (error) {
        Message.error("Error fetching admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const columns: ColumnProps<AdminData>[] = [
    {
      title: "Admin Name",
      dataIndex: "name",
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => (
        <div className="arco-table-custom-filter">
          <Input.Search
            ref={inputRef}
            searchButton
            placeholder="Please enter name"
            value={filterKeys?.[0] || ""}
            onChange={(value) => {
              setFilterKeys?.(value ? [value] : []);
            }}
            onSearch={() => {
              confirm?.();
            }}
          />
        </div>
      ),
      onFilter: (value, row) =>
        value
          ? row.name.toLowerCase().includes(String(value).toLowerCase())
          : true,
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => inputRef.current?.dom?.focus(), 150);
        }
      },
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  return <Table<AdminData> columns={columns} data={admins} loading={loading} />;
};

export default Admins;
