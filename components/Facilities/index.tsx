"use client"
import React from 'react';
import FacilityDashboard from './FacilityDashboard';
import FacilityList from './FacilityList';
import AddFacility from './AddFacility';
import { useAuth } from '@/context/Auth';
const Facilities: React.FC = () => {
  const {user} = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Facility Booking & Activities</h1>
      <FacilityDashboard />
      <div className="my-6">
        {
          user?.role == 'student' || user?.role == 'classrep'?null:(

            <AddFacility />
          )
        }
      </div>
      <FacilityList />
    </div>
  );
};

export default Facilities;
