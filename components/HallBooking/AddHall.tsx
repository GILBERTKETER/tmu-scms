import { useState } from "react";
import { Drawer, Button, Input, Space } from "@arco-design/web-react";
import { Textarea } from "@headlessui/react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "@/app/(site)/api/api";
const AddHall: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [placement, setPlacement] = useState<
    "right" | "left" | "top" | "bottom"
  >("right");
  const [hallName, setHallName] = useState<string>("");
  const [hallCapacity, setHallCapacity] = useState<string>("");
  const [hallDescription, setHallDescription] = useState<string>("");
  const [hallNumber, setHallNumber] = useState<string>("");

  const handleSubmit = async () => {
    try {
      setVisible(false);
      if (!hallName || !hallCapacity || !hallDescription || !hallNumber) {
        toast.error("Please fill all required fields.");
        return;
      }

      const data = {
        hallName,
        hallCapacity,
        hallDescription,
        hallNumber,
      };

      const response = await App.post("/api/add-hall/", data);

      if (response.data.success === false) {
        toast.error(response.data.message);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            response.data.message ||
            "There was a problem submitting your event. Please try again.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Hall Submitted",
        text: response.data.message,
      });
      toast.success(response.data.message);

      setHallName("");
      setHallCapacity("");
      setHallDescription("");
    } catch (error) {
      toast.error("An error occurred while submitting the details.");
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem submitting your event. Please try again.",
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div>
        <Button
          onClick={() => {
            setVisible(true);
          }}
          type="primary"
          style={{ marginTop: 20 }}
        >
          Add Hall
        </Button>

        <Drawer
          width="auto"
          title={<span>Hall Addition</span>}
          visible={visible}
          placement={placement}
          onOk={handleSubmit}
          onCancel={() => setVisible(false)}
        >
          <Space direction="vertical" className="gap-4">
            <Input
              style={{ minWidth: "300px", width: "100%" }}
              allowClear
              placeholder="Enter Hall Name"
              value={hallName}
              onChange={(value) => setHallName(value)}
            />
            <Input
              style={{ minWidth: "300px", width: "100%" }}
              allowClear
              placeholder="Enter Hall Capacity"
              value={hallCapacity}
              onChange={(value) => setHallCapacity(value)}
            />
            <Input
              style={{ minWidth: "300px", width: "100%" }}
              allowClear
              placeholder="Enter Hall Number"
              value={hallNumber}
              onChange={(value) => setHallNumber(value)}
            />
            <Textarea
              placeholder="Enter Hall Description"
              value={hallDescription}
              onChange={(e) => setHallDescription(e.target.value)}
              style={{ minHeight: 64, minWidth: "300px", width: "100%" }}
            />
          </Space>
        </Drawer>
      </div>
    </>
  );
};

export default AddHall;
