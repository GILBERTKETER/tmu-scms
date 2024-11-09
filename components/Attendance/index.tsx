"use client"
import React from 'react'
import AttendanceDashboard from './AttendanceDashboard'
import AttendanceLogs from './AttendanceLogs'
function Attendance() {
  return (
    <div>
      <AttendanceDashboard/>
      <AttendanceLogs />
    </div>
  )
}

export default Attendance
