import React, { useState, forwardRef } from 'react';
import { Table } from '@arco-design/web-react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Define column structure
interface ColumnType {
  title: string;
  dataIndex: string;
  width?: number;
}

const originColumns: ColumnType[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    width: 100,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

// Define data structure
interface DataType {
  key: string;
  name: string;
  salary: number;
  email: string;
}

const data: DataType[] = [
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    email: 'alisa.ross@example.com',
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    email: 'kevin.sandra@example.com',
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    email: 'ed.hellen@example.com',
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    email: 'william.smith@example.com',
  },
];

// Custom resize handle
const CustomResizeHandle = forwardRef<HTMLSpanElement, { handleAxis: string }>(
  ({ handleAxis, ...restProps }, ref) => {
    return (
      <span
        ref={ref}
        className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
        {...restProps}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    );
  }
);

// Resizable title component
interface ResizableTitleProps {
  width?: number;
  onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
}

const ResizableTitle: React.FC<ResizableTitleProps & React.HTMLAttributes<HTMLTableHeaderCellElement>> = ({
  onResize,
  width,
  ...restProps
}) => {
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={<CustomResizeHandle handleAxis="e" />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const App: React.FC = () => {
  const [columns, setColumns] = useState(
    originColumns.map((column, index) => {
      if (column.width) {
        return {
          ...column,
          onHeaderCell: (col: ColumnType) => ({
            width: col.width,
            onResize: handleResize(index),
          }),
        };
      }

      return column;
    })
  );

  const handleResize = (index: number) => (
    e: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setColumns((prevColumns) => {
      const nextColumns = [...prevColumns];
      nextColumns[index] = { ...nextColumns[index], width: size.width };
      return nextColumns;
    });
  };

  const components = {
    header: {
      th: ResizableTitle,
    },
  };

  return (
    <Table
      className="table-demo-resizable-column mb-10"
      components={components}
      border
      borderCell
      columns={columns}
      data={data}
    />
  );
};

export default App;
