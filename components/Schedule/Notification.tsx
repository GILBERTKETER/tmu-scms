import { notification } from '@arco-design/web-react';

export const showSuccessNotification = (message: string) => {
  notification.success({
    title: 'Success',
    content: message,
  });
};

export const showErrorNotification = (message: string) => {
  notification.error({
    title: 'Error',
    content: message,
  });
};
