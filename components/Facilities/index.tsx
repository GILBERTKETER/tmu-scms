"use client"
import React from 'react';
import FacilityDashboard from './FacilityDashboard';
import FacilityList from './FacilityList';
import AddFacility from './AddFacility';

const Facilities: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Facility Booking & Activities</h1>
      <FacilityDashboard />
      <div className="my-6">
        <AddFacility />
      </div>
      <FacilityList />
    </div>
  );
};

export default Facilities;
