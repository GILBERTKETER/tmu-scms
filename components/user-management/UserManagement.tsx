// components/UserManagement.tsx
import React, { useState } from 'react';
import { Button } from '@arco-design/web-react';
import UserStats from './UserStats';
import UserTable from './UserTable';
import AddUserModal from './AddUserModal';

const UserManagement: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <UserStats />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className='text-primary font-bold'>User Management</h2>
        <Button type="primary" onClick={openModal}>Add New User</Button>
      </div>
      <UserTable />
      <AddUserModal visible={isModalVisible} onClose={closeModal} />
    </div>
  );
};

export default UserManagement;
