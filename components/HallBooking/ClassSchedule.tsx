import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Message } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';

const FormItem = Form.Item;

function ClassSchedule() {
  const [classes, setClasses] = useState([
    { id: 1, name: 'ccs 101', hall: null, time: '09:00 AM' },
    { id: 2, name: 'ccs 202', hall: 'Hall A', time: '11:00 AM' },
  ]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Class Name', dataIndex: 'name' },
    { title: 'Hall', dataIndex: 'hall', render: (hall) => hall || 'Not assigned' },
    { title: 'Time', dataIndex: 'time' },
    {
      title: 'Action',
      render: (_, record) => (
          <IconPlus className='cursor-pointer' onClick={() => showModal(record)}/>
      ),
    },
  ];

  const showModal = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleOk = () => {
    form.validate().then((values) => {
      setClasses(classes.map((c) => (c.id === values.id ? { ...c, ...values } : c)));
      setVisible(false);
      Message.success('Hall assigned successfully');
    });
  };

  return (
    <div style={{ padding: '20px', width:"100%" }}>
      <Table columns={columns} data={classes} />
      <Modal
        title="Assign Hall"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <FormItem field="id" hidden />
          <FormItem label="Class Name" field="name" disabled />
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

export default ClassSchedule;