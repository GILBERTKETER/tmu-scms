import App from "@/app/(site)/api/api"
import { useState, useEffect } from "react";
import {
  Button,
  Popover,
  Message,
  TimePicker,
  DatePicker,
} from "@arco-design/web-react";
import { Modal, Form, Input, Select, Switch, Space } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const FormItem = Form.Item;

function EventManagement() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [isOnline, setIsOnline] = useState(false);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("eventFormData") || "{}");
    if (savedData) {
      form.setFieldsValue(savedData); // Set form values from localStorage
      setIsOnline(savedData.online || false); // Restore the 'online' field
    }
  }, [form]);

  // Save form data to localStorage when form values change
  useEffect(() => {
    const formValues = form.getFieldsValue();
    localStorage.setItem("eventFormData", JSON.stringify(formValues));
  }, [form]);

  // Handle event type change (online/offline)
  const handleEventTypeChange = (checked: boolean) => {
    setIsOnline(checked);
    form.setFieldValue('online', checked); // Update form field
  };

  // Submit form data to the server
  const onSubmit = async (formData: any) => {
    try {
      // Post data to backend
      const response = await App.post('/api/add-event/', formData);
      // Show success Swal alert
      Swal.fire({
        icon: "success",
        title: "Event Submitted",
        text: "Your event has been successfully added.",
      });
      if (!response.data.success == true){
        toast.error(response.data.error);

      }
      toast.success(response.data.message);
      // Clear localStorage and reset form
      localStorage.removeItem("eventFormData");
      form.resetFields();
      setVisible(false);
    } catch (error) {
      // Show error Swal alert
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem submitting your event. Please try again.",
      });
    }
    setConfirmLoading(false);
  };

  const onOk = () => {
    form.validate().then((res) => {
      setConfirmLoading(true);
      // Call function to submit data to backend
      onSubmit(res);
    }).catch((err) => {
      // Validation error
      Message.error("Please fill in all required fields.");
    });
  };

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <>
    <ToastContainer/>
      <div className="flex h-auto w-full items-center justify-end py-4">
        <Popover
          title="Events Management"
          content={<p>Add another Event</p>}
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
          labelCol={{ style: { flexBasis: 90 } }}
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
