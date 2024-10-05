import React, { useState } from "react";
import { List, Avatar, Popconfirm, Message, Modal, Input, Button, Form } from "@arco-design/web-react";
import { IconEdit, IconDelete, IconDown } from "@arco-design/web-react/icon";

interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
}

interface UpcomingEventsComponentProps {
  events: Event[];
  onEdit: (updatedEvent: Event) => void; // Update the event after editing
  onDelete: (eventId: number) => void;
}

const UpcomingEventsComponent: React.FC<UpcomingEventsComponentProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // Event being edited

  const displayedEvents: Event[] = showMore ? events : events.slice(0, 5);

  // Handle opening the modal with the selected event's data
  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsModalVisible(true);
  };

  // Handle saving the edited event
  const handleSaveEdit = () => {
    if (editingEvent) {
      onEdit(editingEvent); // Pass the updated event data to the parent component
      setIsModalVisible(false); // Close the modal
    }
  };

  // Handle form field changes
  const handleFormChange = (key: keyof Event, value: string) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [key]: value });
    }
  };

  const render = (actions: React.ReactNode[], item: Event, index: number) => (
    <List.Item key={index} actions={actions}>
      <List.Item.Meta
        avatar={<Avatar shape="square">A</Avatar>}
        title={item.title}
        description={`${item.description} - ${item.start}`}
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
      title="Confirm"
      content="Are you sure you want to delete?"
      onOk={() => {
        onDelete(event.id);  // Handle delete action inside onOk
        Message.info({
          content: "Event deleted",
        });
      }}
      onCancel={() => {
        Message.error({
          content: "Delete canceled",
        });
      }}
      key="delete"  // Make sure the key is applied to Popconfirm
    >
      <span className="list-demo-actions-icon">
        <IconDelete />
      </span>
    </Popconfirm>,
  ];

  const footer = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() => setShowMore(!showMore)}
      onKeyDown={(e) => {
        const keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          setShowMore(!showMore);
        }
      }}
    >
      <span className="list-demo-actions-button" tabIndex={0}>
        {showMore ? "Show Less" : "Show More"}
        <IconDown style={{ marginLeft: 8 }} />
      </span>
    </div>
  );

  return (
    <>
      <List
        className="list-demo-actions"
        style={{ width: "100%", marginBottom: 48 }}
        dataSource={displayedEvents}
        render={(item, index) => render(actions(item), item, index)}
        footer={footer}
      />

      {/* Modal for editing event */}
      <Modal
        visible={isModalVisible}
        title="Edit Event"
        onOk={handleSaveEdit}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveEdit}>
            Save
          </Button>,
        ]}
      >
        {editingEvent && (
          <Form>
            <Form.Item label="Title">
              <Input
                value={editingEvent.title}
                onChange={(value) => handleFormChange("title", value)}
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input
                value={editingEvent.description}
                onChange={(value) => handleFormChange("description", value)}
              />
            </Form.Item>
            <Form.Item label="Start Time">
              <Input
                value={editingEvent.start}
                onChange={(value) => handleFormChange("start", value)}
              />
            </Form.Item>
            <Form.Item label="End Time">
              <Input
                value={editingEvent.end}
                onChange={(value) => handleFormChange("end", value)}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

UpcomingEventsComponent.defaultProps = {
  events: [],
};

export default UpcomingEventsComponent;
