import React from 'react'
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer 
  } from "recharts";
  
function Charts() {
    const data = [
        { name: "Jan", incidents: 5 },
        { name: "Feb", incidents: 3 },
        { name: "Mar", incidents: 8 },
        { name: "Apr", incidents: 2 },
        { name: "May", incidents: 4 },
      ];
  return (
    <div className="mb-10" style={{ width: "100%" }}>
    <h2 className="mb-4 text-center text-2xl font-semibold">
      Incident Reports (Monthly)
    </h2>
    <div className="flex justify-center">
     
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          className="rounded-lg bg-white p-4 shadow-lg"
        >
          <Line type="monotone" dataKey="incidents" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
  )
}

export default Charts
