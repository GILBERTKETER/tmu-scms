import { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Message } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import App from '@/app/(site)/api/api';

function Admins() {
  const [admins, setAdmins] = useState([]); 
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await App.get("/api/auth/get-all-admins/");
        if (response.data.success) {
          const adminData = response.data.data.map((admin, index) => ({
            key: index + 1,
            name: admin.full_name,
            department: admin.program,
            email: admin.email,
          }));
          setAdmins(adminData);
        } else {
          Message.error(response.data.message || "Failed to fetch admin data");
        }
      } catch (error) {
        Message.error("Error fetching admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const columns = [
    {
      title: 'Admin Name',
      dataIndex: 'name',
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => (
        <div className='arco-table-custom-filter'>
          <Input.Search
            ref={inputRef}
            searchButton
            placeholder='Please enter name'
            value={filterKeys[0] || ''}
            onChange={(value) => {
              setFilterKeys(value ? [value] : []);
            }}
            onSearch={() => {
              confirm();
            }}
          />
        </div>
      ),
      onFilter: (value, row) => (value ? row.name.indexOf(value) !== -1 : true),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => inputRef.current.focus(), 150);
        }
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  return <Table columns={columns} data={admins} loading={loading} />;
}

export default Admins;
