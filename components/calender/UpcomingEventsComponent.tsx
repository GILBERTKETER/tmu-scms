import React, { useState, useEffect } from "react";
import { List, Avatar, Popconfirm, Message, Modal, Input, Button, Form, Switch, Select } from "@arco-design/web-react";
import { IconEdit, IconDelete, IconDown } from "@arco-design/web-react/icon";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  start_time: string;
  end_time: string;
  event_type: string;
  address: string;
  link: string;
  is_online: boolean;
}

interface UpcomingEventsComponentProps {
  events: Event[];
  onEdit: (updatedEvent: Event) => void;
  onDelete: (eventId: number) => void;
}

const FormItem = Form.Item;

const UpcomingEventsComponent: React.FC<UpcomingEventsComponentProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [form] = Form.useForm();

  const displayedEvents = showMore ? events : events.slice(0, 5);

  useEffect(() => {
    if (editingEvent) {
      setIsOnline(editingEvent.is_online);
    }
  }, [editingEvent]);

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsOnline(event.is_online);
    form.setFieldsValue(event);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validate();
      if (editingEvent) {
        const updatedEvent: Event = {
          ...editingEvent,
          ...values,
        };
        onEdit(updatedEvent);
        setIsModalVisible(false);
        form.clearFields();
      }
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.clearFields();
    setEditingEvent(null);
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsOnline(checked);
    form.setFieldValue('is_online', checked);
    if (checked) {
      form.setFieldValue('address', '');
    } else {
      form.setFieldValue('link', '');
    }
  };

  const render = (actions: React.ReactNode[], item: Event, index: number) => (
    <List.Item key={item.id} actions={actions}>
      <List.Item.Meta
        title={item.title}
        description={`${item.description} on ${item.date} as from ${item.start_time} to ${item.end_time} at ${item.address || item.link}`}
      />
    </List.Item>
  );

  const actions = (event: Event) => [
    <span
      className="list-demo-actions-icon"
      onClick={() => handleEditClick(event)}
      key="edit"
    >
      <IconEdit />
    </span>,
    <Popconfirm
      focusLock
      title="Confirm Delete"
      content="Are you sure you want to delete this event?"
      onOk={() => {
        onDelete(event.id);
      
      }}
      onCancel={() => {
        Message.error({
          content: "Delete canceled",
        });
      }}
    >
      <span className="list-demo-actions-icon">
        <IconDelete />
      </span>
    </Popconfirm>,
  ];

  const footer = events.length > 5 ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() => setShowMore(!showMore)}
    >
      <span className="list-demo-actions-button">
        {showMore ? "Show Less" : "Show More"}
        <IconDown style={{ marginLeft: 8 }} />
      </span>
    </div>
  ) : null;

  return (
    <>
      <List
        className="list-demo-actions"
        style={{ width: "100%" }}
        dataSource={displayedEvents}
        render={(item, index) => render(actions(item), item, index)}
        footer={footer}
      />

      <Modal
        visible={isModalVisible}
        title="Edit Event"
        onOk={handleSaveEdit}
        onCancel={handleCancel}
        autoFocus={false}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveEdit}>
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingEvent || undefined}
        >
          <FormItem label="Title" field="title" rules={[{ required: true }]}>
            <Input placeholder="Event title" />
          </FormItem>

          <FormItem label="Description" field="description" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Event description" />
          </FormItem>

          <FormItem label="Date" field="date" rules={[{ required: true }]}>
            <Input type="date" />
          </FormItem>

          <FormItem label="Start Time" field="start_time" rules={[{ required: true }]}>
            <Input type="time" />
          </FormItem>

          <FormItem label="End Time" field="end_time" rules={[{ required: true }]}>
            <Input type="time" />
          </FormItem>

          <FormItem label="Event Type" field="event_type" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' }
              ]}
            />
          </FormItem>

          <FormItem label="Event Format" field="is_online" rules={[{ required: true }]}>
            <Switch
              checked={isOnline}
              onChange={handleSwitchChange}
              checkedText="Online"
              uncheckedText="Offline"
            />
          </FormItem>

          {isOnline ? (
            <FormItem label="Meeting Link" field="link" rules={[{ required: true }]}>
              <Input placeholder="Enter meeting link" />
            </FormItem>
          ) : (
            <FormItem label="Address" field="address" rules={[{ required: true }]}>
              <Input placeholder="Enter physical address" />
            </FormItem>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpcomingEventsComponent;