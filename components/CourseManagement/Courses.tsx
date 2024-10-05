import React, { useState } from "react";
import { Table, Typography, Button, Input } from "@arco-design/web-react";

// Define the structure of each row in the table
interface TableData {
  key: string;
  code: string;
  course: string;
}

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    fixed: "left" as const,
  },
  {
    title: "Course",
    dataIndex: "course",
  },
];

const initialData: TableData[] = [
  {
    key: "1",
    course: "Jane Doe",
    code: "23000",
  },
  {
    key: "2",
    course: "Alisa Ross",
    code: "25000",
  },
  {
    key: "3",
    course: "Kevin Sandra",
    code: "22000",
  },
  {
    key: "4",
    course: "Ed Hellen",
    code: "17000",
  },
  {
    key: "5",
    course: "William Smith",
    code: "27000",
  },
];

const App: React.FC = () => {
  // State for filtered data and search term
  const [filteredData, setFilteredData] = useState<TableData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle search input changes (value is passed directly)
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const filtered = initialData.filter((item) =>
      item.code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="shadow-lg bg-gray-50">
      {/* Filter input */}
      <Input.Search
        placeholder="Filter by Code"
        value={searchTerm}
        onChange={handleSearch} // value is directly passed here
        allowClear
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Table */}
      <Table
        style={{
          marginTop: 20,
        }}
        columns={columns.concat({
          title: "Operation",
          dataIndex: "operation",
          render: () => (
            <Button type="primary" size="mini">
              Confirm
            </Button>
          ),
          fixed: "right" as const,
          width: 100,
        })}
        data={filteredData}
        scroll={{
          x: 300,
        }}
        border={{
          wrapper: true,
          cell: true,
        }}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row></Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default App;
