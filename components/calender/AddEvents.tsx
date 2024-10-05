// EventManagement.tsx
import { useState } from "react";
import {
  Button,
  Popover,
  Message,
  TimePicker,
  DatePicker,
} from "@arco-design/web-react";
import { Modal, Form, Input, Select, Switch, Space } from "@arco-design/web-react";
import { IconInfoCircle, IconPlus } from "@arco-design/web-react/icon";
const FormItem = Form.Item;

function EventManagement() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  function onOk() {
    form.validate().then((res) => {
      setConfirmLoading(true);
      setTimeout(() => {
        Message.success("Success!");
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

  const [isOnline, setIsOnline] = useState(false);

  const handleEventTypeChange = (checked: boolean) => {
    setIsOnline(checked);
  };

  return (
    <>
      <div className="flex h-auto w-full items-center justify-end py-4">
        <Popover
          title="Events Management"
          content={
            <span>
              <p>Add another Event</p>
            </span>
          }
        >
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => setVisible(true)}
          />
        </Popover>
      </div>

      <Modal
        title="Add events to the calendar."
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
            // style: { flexBasis: "calc(100% - 90px)" },
          }}
        >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
        <FormItem field="title" rules={[{ required: true }]}>
          <Input placeholder="Title" style={{ width: '100%' }} />
        </FormItem>

        <FormItem field="date" rules={[{ required: true }]}>
          <DatePicker placeholder="Date" style={{ width: '100%' }} />
        </FormItem>

        <FormItem field="time" rules={[{ required: true }]}>
          <TimePicker.RangePicker style={{ width: '100%' }} />
        </FormItem>

        <FormItem field="description" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Description" style={{ width: '100%' }} />
        </FormItem>

        <FormItem field="visibility" rules={[{ required: true }]}>
          <Select
            options={['Public', 'Private']}
            placeholder="Visibility"
            style={{ width: '100%' }}
          />
        </FormItem>

        <FormItem field="online" rules={[{ required: true }]}>
          <Switch
            checked={isOnline}
            onChange={handleEventTypeChange}
            checkedText="Online"
            uncheckedText="Offline"
          />
        </FormItem>

        {isOnline ? (
          <FormItem field="link" rules={[{ required: true }]}>
            <Input placeholder="Online Link" style={{ width: '100%' }} />
          </FormItem>
        ) : (
          <FormItem field="address" rules={[{ required: true }]}>
            <Input placeholder="Address" style={{ width: '100%' }} />
          </FormItem>
        )}
      </Space>
        </Form>
      </Modal>
    </>
  );
}

export default EventManagement;
