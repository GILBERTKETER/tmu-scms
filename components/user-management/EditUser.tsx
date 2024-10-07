import { useState } from 'react';
import { Modal, Button, Form, Input, Select, Message } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';
const FormItem = Form.Item;

function App() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  function onOk() {
    form.validate().then((res) => {
      setConfirmLoading(true);
      setTimeout(() => {
        Message.success('Success !');
        setVisible(false);
        setConfirmLoading(false);
      }, 1500);
    });
  }

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  return (
    <div>
     
      <IconEdit className='cursor-pointer' onClick={() => setVisible(true)}/>
      <Modal
        title='Add User'
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
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
    </div>
  );
}

export default App;
