import { Notification } from '@arco-design/web-react';

export const showSuccessNotification = (message: string) => {
  Notification.success({
    title: 'Success',
    content: message,
  });
};

export const showErrorNotification = (message: string) => {
  Notification.error({
    title: 'Error',
    content: message,
  });
};
