import React, { useState } from 'react';
import { Modal, Button, Input, DatePicker, Message, Icon } from '@arco-design/web-react';
import App from "@/app/(site)/api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconPlus } from '@arco-design/web-react/icon';

interface Announcement {
  title: string;
  content: string;
  published_date: Date | undefined;
  expiry_date: Date | undefined;
}

function AddAnnouncements(): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [publishedDate, setPublishedDate] = useState<Date | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);

  const handleSubmit = () => {
    if (!title || !content) {
      Message.error("Title and content are required.");
      return;
    }

    const newAnnouncement: Announcement = {
      title,
      content,
      published_date: publishedDate,
      expiry_date: expiryDate,
    };

    App.post('/api/announcements/add/', newAnnouncement)
      .then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message || 'Announcement added successfully');
          Swal.fire({
            icon: "success",
            title: "Announcement Submitted",
            text: "Your announcement has been successfully added.",
          });
          setVisible(false);
        } else {
          toast.error(response.data.message || 'Failed to add announcement');
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Failed to add announcement. Please try again.",
          });
        }
      })
      .catch(() => {
        toast.error('Failed to add announcement');
        Swal.fire({
          icon: "error",
          title: "Unknown Error.",
          text: "Failed to add announcement. Please try again.",
        });
      });
  };

  return (
    <div>
      <ToastContainer />
      <Button onClick={() => setVisible(true)} type='outline'>
        <IconPlus/>
      </Button>
      <Modal
        title='Add Announcement'
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <Input
          placeholder='Title'
          value={title}
          onChange={(value) => setTitle(value as string)}
          style={{ marginBottom: 12 }}
        />
        <Input.TextArea
          placeholder='Content'
          value={content}
          onChange={(value) => setContent(value as string)}
          style={{ marginBottom: 12 }}
        />
        <DatePicker
          placeholder='Published Date'
          value={publishedDate}
          onChange={(date:any) => setPublishedDate(date)}
          style={{ marginBottom: 12, width: '100%' }}
        />
        <DatePicker
          placeholder='Expiry Date'
          value={expiryDate}
          onChange={(date:any) => setExpiryDate(date)}
          style={{ marginBottom: 12, width: '100%' }}
        />
      </Modal>
    </div>
  );
}

export default AddAnnouncements;
