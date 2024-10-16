import { useState } from 'react';
import { Drawer, Button, Form, Input, Select, DatePicker } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';
const formItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

function App() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  return (
    <div>
      
        <p> <IconEdit  onClick={() => {
          setVisible(true);
        }} /></p>
      <Drawer
        width={314}
        title={<span>Basic Information </span>}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={() => {
          form.validate().then((res) => {
            setConfirmLoading(true);
            setTimeout(() => {
              setVisible(false);
              setConfirmLoading(false);
            }, 1500);
          });
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form {...formItemLayout} form={form} layout='vertical'>
          <Form.Item label='Name' field='name' rules={[{ required: true }]}>
            <Input placeholder='Plear enter' />
          </Form.Item>
          <Form.Item label='URL' required field='url' rules={[{ required: true }]}>
            <Input placeholder='Plear enter' prefix='http://' suffix='.com' />
          </Form.Item>
          <Form.Item label='Hometown' field='hometown' rules={[{ required: true }]}>
            <Select placeholder='Plear select' options={['Beijing', 'Shanghai']} />
          </Form.Item>
          <Form.Item label='Date of Birth' field='birthday' rules={[{ required: true }]}>
            <DatePicker placeholder='Plear select' />
          </Form.Item>
          <Form.Item
            label='Self Introduction'
            required
            field='introduction'
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder='Plear enter' />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default App;
