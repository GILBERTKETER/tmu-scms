// components/StudentCheckInDrawer.tsx
import React from 'react';
import { Drawer, Checkbox, Button } from '@arco-design/web-react';

interface Student {
  id: number;
  name: string;
}

const studentsData: Student[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
  // Add more students as needed
];

interface StudentCheckInDrawerProps {
  visible: boolean;
  onClose: () => void;
  classItem: any;
}

const StudentCheckInDrawer: React.FC<StudentCheckInDrawerProps> = ({
  visible,
  onClose,
  classItem,
}) => {
  const handleCheckIn = (studentId: number) => {
    console.log(`Student with ID ${studentId} checked in.`);
  };

  return (
    <Drawer
      width={332}
      title={<span>Check-In for {classItem?.name || ''}</span>}
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      closable={true} // Enables the close button on the top right
    >
      <div>
        {studentsData.map((student) => (
          <div key={student.id}>
            <Checkbox onChange={() => handleCheckIn(student.id)}>
              {student.name}
            </Checkbox>
          </div>
        ))}
      </div>
      
    </Drawer>
  );
};

export default StudentCheckInDrawer;
