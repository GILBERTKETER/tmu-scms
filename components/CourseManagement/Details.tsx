import React from 'react'

function Details() {
  return (
    <div className="w-full bg-white  rounded-lg py-6 space-y-5">
    {/* <!-- Student Information --> */}
    <div className="text-center border-b-2 pb-4">
      <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
      <p className="text-gray-600">Admission Number: <span className="font-semibold">AD123456</span></p>
    </div>
  
    {/* <!-- Student Name --> */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">Name:</span>
      <span className="text-gray-800 font-semibold">John Doe</span>
    </div>
  
    {/* <!-- Number of Courses Enrolled --> */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">Courses Enrolled:</span>
      <span className="text-gray-800 font-semibold">5</span>
    </div>
  
    {/* <!-- Current Course --> */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">Course:</span>
      <span className="text-gray-800 font-semibold">Computer Science</span>
    </div>
  
    {/* <!-- Year of Study --> */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">Year of Study:</span>
      <span className="text-gray-800 font-semibold">3rd Year</span>
    </div>
  
    {/* <!-- Semester --> */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">Semester:</span>
      <span className="text-gray-800 font-semibold">2nd Semester</span>
    </div>
  
    {/* <!-- Action Button --> */}
    <div className="flex justify-center mt-6">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring focus:ring-blue-300">
        View Course Details
      </button>
    </div>
  </div>
  
  )
}

export default Details
