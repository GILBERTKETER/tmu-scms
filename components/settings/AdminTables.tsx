import { useState, useRef } from 'react';
import { Table, Input, Button } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
const data = [
  {
    key: '1',
    name: 'Jane Doe',
    department: '32 Park Road, London',
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    department: '35 Park Road, London',
    email: 'alisa.ross@example.com',
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    department: '31 Park Road, London',
    email: 'kevin.sandra@example.com',
  },
  {
    key: '4',
    name: 'Ed Hellen',
    department: '42 Park Road, London',
    email: 'ed.hellen@example.com',
  },
  {
    key: '5',
    name: 'William Smith',
    department: '62 Park Road, London',
    email: 'william.smith@example.com',
  },
];

function App() {
  const inputRef = useRef(null);
  const columns = [
    {
      title: 'Admin Name',
      dataIndex: 'name',
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
        return (
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
        );
      },
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
  return <Table columns={columns} data={data} />;
}

export default App;
