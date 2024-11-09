import { Button, Message, Popconfirm } from "@arco-design/web-react";
import { IconEdit, IconDelete } from "@arco-design/web-react/icon";
import ProgressBar from "./ProgressBar";
import { useAuth } from "@/context/Auth";
interface ClassCardProps {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  progress: number;
  hallName: string;
  course_name: string;
  instructor: string;
  hallNumber: string;
  programName: string;
  course_code: string;
  date: string;
  recurring_days: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  course_name,
  instructor,
  start_time,
  course_code,
  end_time,
  hallName,
  hallNumber,
  programName,
  onEdit,
  onDelete,
  date,
  recurring_days,
}) => {
  const { user } = useAuth();
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Program: {programName}</h3>
        {user?.role == "student" ? null : (
          <div className="flex space-x-2">
            <Button shape="circle" icon={<IconEdit />} onClick={onEdit} />
            <Popconfirm
              focusLock
              title="Confirm"
              content="Are you sure you want to delete?"
              onOk={onDelete}
              onCancel={() => {
                Message.error({
                  content: "Cancel",
                });
              }}
            >
              <Button shape="circle" icon={<IconDelete />} />
            </Popconfirm>
          </div>
        )}
      </div>
      <p className="mt-2 text-gray-500">{course_name + " " + course_code}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-400">{start_time + "-" + end_time}</p>
        <p className="text-gray-500">
          {date ? `On: ${date}` : `Every: ${recurring_days}`}
        </p>
      </div>
      <p className="text-gray-500">
        Hall: {hallName} ({hallNumber})
      </p>
      <p className="text-gray-500">Instructor: {"Dr." + instructor}</p>
      <ProgressBar progress={50} />
    </div>
  );
};

export default ClassCard;
