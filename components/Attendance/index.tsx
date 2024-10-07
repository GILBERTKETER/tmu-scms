"use client"
import React from 'react'
import ClassList from './ClassList'
import AttendanceDashboard from './AttendanceDashboard'
function Attendance() {
  return (
    <div>
      <AttendanceDashboard/>
      <ClassList />
    </div>
  )
}

export default Attendance
