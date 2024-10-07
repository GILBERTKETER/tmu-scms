import { Button, Message, Popconfirm } from '@arco-design/web-react';
import { IconEdit, IconDelete } from '@arco-design/web-react/icon'
import ProgressBar from './ProgressBar';  
interface ClassCardProps {
  title: string;
  description: string;
  time: string;
  progress: number;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ title, description, time, progress, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <Button shape="circle" icon={<IconEdit />} onClick={onEdit} />
          <Popconfirm
        focusLock
        title='Confirm'
        content='Are you sure you want to delete?'
        onOk={onDelete}
        onCancel={() => {
          Message.error({
            content: 'cancel',
          });
        }}

      >
          <Button shape="circle" icon={<IconDelete />}  />
          </Popconfirm>
        </div>
      </div>
      <p className="text-gray-500 mt-2">{description}</p>
      <p className="text-gray-400">{time}</p>
      <ProgressBar progress={progress} />
    </div>
  );
};

export default ClassCard;
