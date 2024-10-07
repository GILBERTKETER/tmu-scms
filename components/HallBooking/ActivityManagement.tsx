import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Message } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';

const FormItem = Form.Item;

function ActivityManagement() {
  const [activities, setActivities] = useState([
    { id: 1, name: 'Science Fair', date: '2024-05-15', hall: 'Hall A' },
    { id: 2, name: 'Career Day', date: '2024-06-01', hall: 'Hall B' },
  ]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Activity Name', dataIndex: 'name' },
    { title: 'Date', dataIndex: 'date' },
    { title: 'Hall', dataIndex: 'hall' },
    {
      title: 'Action',
      render: (_, record) => (
          <IconEdit className='text-primary cursor-pointer' onClick={() => showModal(record)}/>
      ),
    },
  ];

  const showModal = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleOk = () => {
    form.validate().then((values) => {
      setActivities(activities.map((a) => (a.id === values.id ? { ...a, ...values } : a)));
      setVisible(false);
      Message.success('Activity updated successfully');
    });
  };

  return (
    <div style={{ padding: '20px', width:"100%" }}>
      <Table columns={columns} data={activities} />
      <Modal
        title="Edit Activity"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <FormItem field="id" hidden />
          <FormItem label="Activity Name" field="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <FormItem label="Date" field="date" rules={[{ required: true }]}>
            <DatePicker />
          </FormItem>
          <FormItem label="Hall" field="hall" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Hall A">Hall A</Select.Option>
              <Select.Option value="Hall B">Hall B</Select.Option>
              <Select.Option value="Hall C">Hall C</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default ActivityManagement;