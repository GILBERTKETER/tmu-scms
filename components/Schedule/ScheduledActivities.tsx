import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm } from "@arco-design/web-react";
import { IconDelete, IconEdit } from "@arco-design/web-react/icon";
import ScheduleActivityModal from "./ScheduleActivityModal";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import EditActivityModal from "./EditActivityModal"
const ScheduledActivities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await App.get("/api/get-activities/");
        if (response.data && response.data.success) {
          setActivities(response.data.data);
        } else {
          toast.warn("No activities found.");
        }
      } catch (error) {
        toast.error(error.message || "An error occurred while fetching activities.");
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await App.delete("/api/delete-activity/", {
        data: { id }, 
      });
  
      if (response.data && response.data.success) {
        setActivities((prevActivities) =>
          prevActivities.filter((activity) => activity.id !== id)
        );
        toast.success("Activity deleted successfully.");
        Swal.fire({
          icon: "success",
          title: "Deleted successfully",
          text: response.data.message || "Activity deleted successfully.",
        });
      } else {
        toast.error("Failed to delete activity.");
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: response.data.message || "There was a problem deleting the activity. Please try again.",
        });
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while deleting the activity.");
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "There was a problem deleting the activity. Please try again.",
      });
    }
  };
  
  const columns = [
    {
      title: "Activity Name",
      dataIndex: "activity_name",
      key: "activity_name",
    },
    {
      title: "Date",
      dataIndex: "activity_date",
      key: "activity_date",
    },
    {
      title: "Start Time",
      dataIndex: "activity_start_time",
      key: "activity_start_time",
    },
    {
      title: "Location",
      dataIndex: "activity_location",
      key: "activity_location",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle" className="cursor-pointer">
          <EditActivityModal activity_date={record.activity_date} activity_end_time={record.activity_end_time} activity_location={record.activity_location} activity_name={record.activity_name} activity_start_time={record.activity_start_time} id={record.id}/>
          <Popconfirm
            focusLock
            title="Confirm"
            content="Are you sure you want to delete?"
            onOk={() => handleDelete(record.id)}
            onCancel={() => {
              toast.error("Cancel");
            }}
          >
            <IconDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-xl font-semibold">Scheduled Activities</h2>
          <ScheduleActivityModal />
        </div>
        <Table data={activities} columns={columns} pagination={false} />
      </div>
      <ToastContainer />
    </>
  );
};

export default ScheduledActivities;
