import { Modal, Input, Button } from '@arco-design/web-react';
import { useState, useEffect } from 'react';

interface AddEditClassModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (classData: { title: string; description: string; time: string; progress: number }) => void;
  classData?: { title: string; description: string; time: string; progress: number };
}

const AddEditClassModal: React.FC<AddEditClassModalProps> = ({ visible, onClose, onSave, classData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (classData) {
      setTitle(classData.title);
      setDescription(classData.description);
      setTime(classData.time);
      setProgress(classData.progress);
    }
  }, [classData]);

  const handleSave = () => {
    onSave({ title, description, time, progress });
    setTitle('');
    setDescription('');
    setTime('');
    setProgress(0);
    onClose();
  };

  return (
    <Modal visible={visible} onCancel={onClose} title={classData ? 'Edit Class' : 'Add New Class'}>
      <Input placeholder="Class Title" value={title} onChange={setTitle} />
      <Input placeholder="Class Description" value={description} onChange={setDescription} className="mt-2" />
      <Input placeholder="Class Time" value={time} onChange={setTime} className="mt-2" />
      <Input placeholder="Progress %" value={progress} onChange={(e) => setProgress(Number(e))} className="mt-2" />
      <Button onClick={handleSave} type="primary" className="mt-4">Save</Button>
    </Modal>
  );
};

export default AddEditClassModal;
