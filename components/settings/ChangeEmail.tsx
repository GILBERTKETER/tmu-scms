import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Message,
} from "@arco-design/web-react";
const FormItem = Form.Item;

function App() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  function onOk() {
    form.validate().then((res) => {
      setConfirmLoading(true);
      setTimeout(() => {
        Message.success("Success !");
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
      <p
        className="cursor-pointer font-semibold text-blue-600 underline decoration-2"
        onClick={() => setVisible(true)}
      >
        Change
      </p>
      <Modal
        title="Change Email"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...formItemLayout}
          form={form}
          labelCol={{
            style: { flexBasis: 90 },
          }}
          wrapperCol={{
            style: { flexBasis: "calc(100% - 90px)" },
          }}
        >
          <FormItem label="Name" field="name" rules={[{ required: true }]}>
            <Input placeholder="" />
          </FormItem>
          <FormItem
            label="Gender"
            required
            field="sex"
            rules={[{ required: true }]}
          >
            <Select options={["男", "女"]} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
