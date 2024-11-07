import React, { useState, useEffect } from 'react';
import App from "@/app/(site)/api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Details() {
interface UserData {
  admission: string;
  full_name: string;
  program: string;
  year_of_study: number;
  semester: number;
  courses_enrolled:string;
}

const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await App.get('/api/auth/get-user/');
        
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          toast.error(response.data.message || 'Failed to fetch user data.');
        }
      } catch (error:any) {
        toast.error(error.message || 'An error occurred while fetching user data.');
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
      <div className="w-full bg-white rounded-lg py-6 space-y-5">
        {/* Student Information */}
        <div className="text-center border-b-2 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
          <p className="text-gray-600">Admission Number: <span className="font-semibold">{userData.admission}</span></p>
        </div>
        
        {/* Student Name */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Name:</span>
          <span className="text-gray-800 font-semibold">{userData.full_name}</span>
        </div>
        
        {/* Number of Courses Enrolled */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Courses Enrolled:</span>
          <span className="text-gray-800 font-semibold">{userData.courses_enrolled}</span>
        </div>
        
        {/* Current Course */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Course:</span>
          <span className="text-gray-800 font-semibold">{userData.program}</span>
        </div>
        
        {/* Year of Study */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Year of Study:</span>
          <span className="text-gray-800 font-semibold">Year {userData.year_of_study}</span>
        </div>
        
        {/* Semester */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Semester:</span>
          <span className="text-gray-800 font-semibold">Semester {userData.semester}</span>
        </div>
        
        {/* Action Button */}
        <div className="flex justify-center mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring focus:ring-blue-300">
            My Details
          </button>
        </div>
      </div>
    </>
  );
}

export default Details;
