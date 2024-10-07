import { useState } from 'react';
import ClassCard from './ClassCards';
import AddEditClassModal from './AddEditClassModal';

const ClassSchedule: React.FC = () => {
  const [classes, setClasses] = useState([
    { title: 'Math Class', description: 'Algebra & Geometry', time: '10:00 AM - 12:00 PM', progress: 75 },
    { title: 'Physics Class', description: 'Mechanics & Thermo', time: '1:00 PM - 3:00 PM', progress: 50 },
    { title: 'Math Class', description: 'Algebra & Geometry', time: '10:00 AM - 12:00 PM', progress: 75 },
    { title: 'Physics Class', description: 'Mechanics & Thermo', time: '1:00 PM - 3:00 PM', progress: 50 },
  ]);
  
  const [editingClass, setEditingClass] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setModalVisible(true);
  };

  const handleDelete = (title) => {
    setClasses(classes.filter(c => c.title !== title));
  };

  const handleSave = (newClass) => {
    if (editingClass) {
      setClasses(classes.map(c => c.title === editingClass.title ? newClass : c));
    } else {
      setClasses([...classes, newClass]);
    }
    setModalVisible(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {classes.map((classItem, index) => (
        <ClassCard
          key={index}
          title={classItem.title}
          description={classItem.description}
          time={classItem.time}
          progress={classItem.progress}
          onEdit={() => handleEdit(classItem)}
          onDelete={() => handleDelete(classItem.title)}
        />
      ))}
      <AddEditClassModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleSave} classData={editingClass} />
    </div>
  );
};

export default ClassSchedule;
