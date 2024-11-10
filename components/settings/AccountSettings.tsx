import React, { useState, useRef } from "react";
import { useAuth } from "@/context/Auth";
import ChangeEmail from "./ChangeEmail";
import ChangePhone from "./ChangePhone"
import LoadingLayout from "../Layouts/LoadingLayout";
import {
  Form,
  Input,
  Button,
  Grid,
  Tooltip,
  Space,
} from "@arco-design/web-react";
import { IconExclamationCircle } from "@arco-design/web-react/icon";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import App from "@/app/(site)/api/api";
import "react-toastify/dist/ReactToastify.css";

const AccountSettings = () => {
  const formRef = useRef();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const response = await App.post("/api/auth/change-password/", {
        email: user?.email,
        currentPassword: values.currentpassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.cpassword,
      });
      if (response.data.success == true) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text:
            response.data.message ||
            "Your password has been successfully updated!",
        });

        toast.success(
          response.data.message || "Password successfully updated!",
        );
        formRef.current?.resetFields();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message ||
            "An error occurred while changing the password",
        });

        toast.error(
          response.data.message ||
            "An error occurred while changing the password",
        );
      }
    } catch (err:any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "An error occurred while changing the password",
      });

      toast.error("An error occurred while changing the password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingLayout>
      <ToastContainer />
      <div className="min-h-screen w-full p-4 sm:mx-8 xl:mx-auto">
        <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
          <div className="col-span-12 w-full overflow-hidden rounded-xl sm:px-8">
            <div className="pt-4">
              <h1 className="py-2 text-2xl font-semibold">Account settings</h1>
              <p className="text-slate-600">
                Manage your account settings and preferences
              </p>
            </div>

            <hr className="mb-8 mt-4" />

            <p className="py-2 text-xl font-semibold">Email Address</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600">
                Your email address is <strong>{user?.email}</strong>
              </p>
              <ChangeEmail />
            </div>

            <hr className="mb-8 mt-4" />

            <p className="py-2 text-xl font-semibold">Phone Number</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600">
                Your phone number is <strong>{user?.phone_number}</strong>
              </p>
              <ChangePhone />
            </div>

            <hr className="mb-8 mt-4" />

            <Form ref={formRef} autoComplete="off" onSubmit={handleSubmit}>
              <Form.Item required label="Current Password">
                <Grid.Row className="flex items-center justify-between">
                  <Form.Item
                    field="currentpassword"
                    noStyle={{ showErrorTip: true }}
                    rules={[{ required: true }]}
                  >
                    <Input.Password placeholder="Current password" />
                  </Form.Item>
                  <Tooltip content="Current password">
                    <IconExclamationCircle
                      style={{
                        margin: "0 8px",
                        color: "rgb(var(--arcoblue-6))",
                      }}
                    />
                  </Tooltip>
                </Grid.Row>
              </Form.Item>
              <Form.Item
                required
                style={{ marginBottom: 0 }}
                label="New Password"
              >
                <Grid.Row gutter={8}>
                  <Grid.Col span={12}>
                    <Form.Item field="newPassword" rules={[{ required: true }]}>
                      <Input.Password placeholder="Enter New password" />
                    </Form.Item>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Form.Item
                      label="Confirm Password"
                      field="cpassword"
                      rules={[{ required: true }]}
                    >
                      <Input.Password placeholder="Confirm password" />
                    </Form.Item>
                  </Grid.Col>
                </Grid.Row>
              </Form.Item>

              <Form.Item>
                <Space size={24}>
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    Change password
                  </Button>
                  <Button
                    onClick={() => {
                      formRef.current?.resetFields();
                    }}
                  >
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            <hr className="mb-8 mt-4" />
          </div>
        </div>
      </div>
    </LoadingLayout>
  );
};

export default AccountSettings;
