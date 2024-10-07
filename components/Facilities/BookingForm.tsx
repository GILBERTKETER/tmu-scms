import React, { useState } from 'react';
import { Drawer, Button, Input, DatePicker, Select } from '@arco-design/web-react';

const BookingForm: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    // Logic to handle form submission
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>Add Facility</Button>
      <Drawer
        title="Add a Facility"
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={500}
      >
        <div className="mb-4">
          <Input placeholder="Facility Name" />
        </div>
        <div className="mb-4">
          <Select placeholder="Facility Type">
            <Select.Option value="Hall">Hall</Select.Option>
            <Select.Option value="Lab">Lab</Select.Option>
            <Select.Option value="Library">Library</Select.Option>
          </Select>
        </div>
        <div className="mb-4">
          <DatePicker placeholder="Select Date" />
        </div>
        <Button type="primary" onClick={handleSubmit}>Submit</Button>
      </Drawer>
    </>
  );
};

export default BookingForm;
