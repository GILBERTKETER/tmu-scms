import { useState, useEffect } from "react";
import ClassCard from "./ClassCards";
import AddEditClassModal from "./AddEditClassModal";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

interface ClassItem {
  title: string;
  course_name: string;
  course_code: string;
  instructor_name: string;
  time_start: string;
  time_end: string;
  hall_number: string;
  hall_name: string;
  program_name: string;
  date: string;
  recurring_days: string[];
}

const ClassSchedule: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await App.get("/api/get-scheduled-classes/");
        if (response.data.success === true) {
          setClasses(response.data.classes);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error fetching classes:", error as string);
      }
    };

    fetchClasses();
  }, []);

  const handleEdit = (classItem: ClassItem) => {
    setEditingClass(classItem); // Set the current class for editing
    setModalVisible(true);      // Show the modal
  };

  const handleDelete = async (title: string) => {
    try {
      const response = await App.delete(`/api/delete-class/${title}`);
      if (response.data.success) {
        setClasses(classes.filter((c) => c.title !== title));
        toast.success("Class deleted successfully.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting class:", error as string);
    }
  };

  const handleSave = async (updatedClass: ClassItem) => {
    try {
      if (editingClass) {
        // Update existing class
        const response = await App.put(`/api/update-class/${editingClass.title}`, updatedClass);
        if (response.data.success) {
          setClasses(
            classes.map((c) => (c.title === editingClass.title ? updatedClass : c))
          );
          toast.success("Class updated successfully.");
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Add new class
        const response = await App.post("/api/add-class/", updatedClass);
        if (response.data.success) {
          setClasses([...classes, updatedClass]);
          toast.success("Class added successfully.");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Error saving class:", error as string);
    } finally {
      setEditingClass(null);      // Clear the editing class after save
      setModalVisible(false);     // Hide the modal after saving
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem, index) => (
          <ClassCard
            key={index}
            course_name={classItem.course_name}
            course_code={classItem.course_code}
            instructor={classItem.instructor_name}
            start_time={classItem.time_start}
            end_time={classItem.time_end}
            hallNumber={classItem.hall_number} 
            hallName={classItem.hall_name} 
            programName={classItem.program_name} 
            date={classItem.date}
            recurring_days={classItem.recurring_days}
            onEdit={() => handleEdit(classItem)}
            onDelete={() => handleDelete(classItem.title)}
          />
        ))}
        {modalVisible && (
          <AddEditClassModal
          id={editingClass?.id || ""}
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setEditingClass(null);  
            }}
            instructor={editingClass?.instructor_name || ""}
            start_time={editingClass?.time_start || ""}
            end_time={editingClass?.time_end || ""}
            hall={(editingClass?.hall_name && editingClass?.hall_number) ? `${editingClass.hall_name} ${editingClass.hall_number}` : ""}
            recurring_days={editingClass?.recurring_days || []}
          />
        )}
      </div>
    </>
  );
};

export default ClassSchedule;
