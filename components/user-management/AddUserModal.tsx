// components/AddUserModal.tsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from '@arco-design/web-react';

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Add New User"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Name" field="name" rules={[{ required: true, message: 'Please enter the name' }]}>
          <Input placeholder="Enter user's name" />
        </Form.Item>
        <Form.Item label="Email" field="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input placeholder="Enter user's email" />
        </Form.Item>
        <Form.Item label="Role" field="role" rules={[{ required: true, message: 'Please select a role' }]}>
          <Select placeholder="Select role">
            <Select.Option value="student">Student</Select.Option>
            <Select.Option value="lecturer">Lecturer</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
