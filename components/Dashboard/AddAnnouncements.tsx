import React, { useState } from 'react';
import { Modal, Button, Input, DatePicker, Message } from '@arco-design/web-react';
import App from "@/app/(site)/api/api"
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AddAnnouncements() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishedDate, setPublishedDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);

  const handleSubmit = () => {
    if (!title || !content) {
      Message.error("Title and content are required.");
      return;
    }

    const newAnnouncement = {
      title,
      content,
      published_date: publishedDate,
      expiry_date: expiryDate,
    };

    App.post('/api/announcements/add/', {
        newAnnouncement
    })
      .then((response) => {
        if (response.data.success == true) {
            toast.success(response.data.message ||  'Announcement added successfully')
            Swal.fire({
                icon: "success",
                title: "Announceent Submitted",
                text: "Your announcement has been successfully added.",
              });
          setVisible(false);
        } else {
            toast.error(response.data.message ||  'Failed to add announcement')
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Failed to add announcement. Please try again.",
              });
        }
      })
      .catch(() => {
        toast.error( 'Failed to add announcement')
        Swal.fire({
            icon: "error",
            title: "Unknown Error.",
            text: "Failed to add announcement. Please try again.",
          });      });
  };

  return (
    <div>
        <ToastContainer/>
      <Button onClick={() => setVisible(true)} type='ghost'>
        Add Announcement
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
          onChange={setTitle}
          style={{ marginBottom: 12 }}
        />
        <Input.TextArea
          placeholder='Content'
          value={content}
          onChange={setContent}
          style={{ marginBottom: 12 }}
        />
        <DatePicker
          placeholder='Published Date'
          value={publishedDate}
          onChange={setPublishedDate}
          style={{ marginBottom: 12, width: '100%' }}
        />
        <DatePicker
          placeholder='Expiry Date'
          value={expiryDate}
          onChange={setExpiryDate}
          style={{ marginBottom: 12, width: '100%' }}
        />
      </Modal>
    </div>
  );
}

export default AddAnnouncements;
