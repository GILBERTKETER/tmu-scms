import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Message } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';

const FormItem = Form.Item;

function HallManagement() {
  const [halls, setHalls] = useState([
    { id: 1, name: 'Hall A', capacity: 100, status: 'Available' },
    { id: 2, name: 'Hall B', capacity: 150, status: 'Occupied' },
    { id: 3, name: 'Hall C', capacity: 200, status: 'Available' },
  ]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Hall Name', dataIndex: 'name' },
    { title: 'Capacity', dataIndex: 'capacity' },
    { title: 'Status', dataIndex: 'status' },
    {
      title: 'Action',
      render: (_, record) => (
          <IconEdit className='text-primary cursor-pointer' onClick={() => showModal(record)} />
      ),
    },
  ];

  const showModal = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleOk = () => {
    form.validate().then((values) => {
      setHalls(halls.map((h) => (h.id === values.id ? { ...h, ...values } : h)));
      setVisible(false);
      Message.success('Hall updated successfully');
    });
  };

  return (
    <div style={{ padding: '20px' , width:"100%"}}>
      <Table columns={columns} data={halls} />
      <Modal
        title="Edit Hall"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <FormItem field="id" hidden />
          <FormItem label="Hall Name" field="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <FormItem label="Capacity" field="capacity" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </FormItem>
          <FormItem label="Status" field="status" rules={[{ required: true }]}>
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default HallManagement;