import React, { useState, useEffect } from "react";
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/Auth";
import EditDetails from "./EditDetails";
function Details() {
  const { user } = useAuth();
  interface UserData {
    admission: string;
    full_name: string;
    program: string;
    year_of_study: number;
    semester: number;
    courses_enrolled: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await App.get("/api/auth/get-user/");

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          toast.error(response.data.message || "Failed to fetch user data.");
        }
      } catch (error: any) {
        toast.error(
          error.message || "An error occurred while fetching user data.",
        );
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!userData) return <div>No user data available.</div>;

  return (
    <>
      <ToastContainer />
      <div className="w-full space-y-5 rounded-lg bg-white py-6">
        {/* Student Information */}
        <div className="border-b-2 pb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            My personal Details
          </h2>
          <p className="text-gray-600">
            Identification:{" "}
            <span className="font-semibold">{userData.admission}</span>
          </p>
        </div>

        {/* Student Name */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">Name:</span>
          <span className="font-semibold text-gray-800">
            {userData.full_name}
          </span>
        </div>

        {/* Number of Courses Enrolled */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">Courses Enrolled:</span>
          <span className="font-semibold text-gray-800">
            {userData.courses_enrolled}
          </span>
        </div>

        {/* Current Course */}
        {user?.role == "lecturer" || user?.role == "Lecturer" ? null : (
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Course:</span>
            <span className="font-semibold text-gray-800">
              {userData.program}
            </span>
          </div>
        )}

        {/* Year of Study */}
        {user?.role == "lecturer" || user?.role == "Lecturer" ? null : (
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Year of Study:</span>
            <span className="font-semibold text-gray-800">
              Year {userData.year_of_study}
            </span>
          </div>
        )}

        {/* Semester */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">Semester:</span>
          <span className="font-semibold text-gray-800">
            Semester {userData.semester}
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
         <EditDetails/>
        </div>
      </div>
    </>
  );
}

export default Details;
