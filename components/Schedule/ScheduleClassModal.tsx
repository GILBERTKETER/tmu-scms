import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select, Message, TimePicker } from '@arco-design/web-react';
import { IconCalendar, IconInfoCircle } from '@arco-design/web-react/icon';
import axios from 'axios'; // Import axios for API calls
const FormItem = Form.Item;

function App({ course_name, course_code, course_id }) {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [halls, setHalls] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]); // To hold already booked slots

  // Fetch halls and instructors on component mount
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get('/api/halls'); // Replace with your actual API endpoint
        setHalls(response.data);
      } catch (error) {
        console.error('Error fetching halls:', error);
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await axios.get('/api/instructors'); // Replace with your actual API endpoint
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };

    fetchHalls();
    fetchInstructors();
  }, []);

  // Check if the selected hall is already booked
  const isHallAvailable = (hallId, selectedTime) => {
    return bookedSlots.every((slot) => {
      return slot.hallId !== hallId || !(
        (selectedTime[0] >= slot.startTime && selectedTime[0] < slot.endTime) ||
        (selectedTime[1] > slot.startTime && selectedTime[1] <= slot.endTime) ||
        (selectedTime[0] <= slot.startTime && selectedTime[1] >= slot.endTime)
      );
    });
  };

  const onOk = async () => {
    const values = await form.validate();
    const { hall, timeRange } = values;

    if (!isHallAvailable(hall, timeRange)) {
      Message.error('The selected hall is already booked during this time.');
      return;
    }

    setConfirmLoading(true);
    // You can add API logic to submit the form data here
    setTimeout(() => {
      Message.success('Class scheduled successfully!');
      setVisible(false);
      setConfirmLoading(false);
    }, 1500);
  };

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
      <Button type="primary" icon={<IconCalendar />} onClick={() => setVisible(true)}>
        Schedule Class
      </Button>
      <Modal
        title={`Schedule ${course_name} Class`}
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
            style: { flexBasis: 'calc(100% - 90px)' },
          }}
        >
          <FormItem label='Course ID' field='id' rules={[{ required: true }]}>
            <Input value={course_id} readOnly />
          </FormItem>
          <FormItem label='Course Code' field='code' rules={[{ required: true }]}>
            <Input value={course_code} readOnly />
          </FormItem>
          <FormItem label='Hall' field='hall' rules={[{ required: true }]}>
            <Select options={halls.map(hall => ({ label: hall.name, value: hall.id }))} />
          </FormItem>
          <FormItem label='Instructor' field='instructor' rules={[{ required: true }]}>
            <Select options={instructors.map(inst => ({ label: inst.name, value: inst.id }))} />
          </FormItem>
          <FormItem label='Time Range' field='timeRange' rules={[{ required: true }]}>
            <TimePicker.RangePicker prefix={<IconInfoCircle />} style={{ width: 250 }} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
