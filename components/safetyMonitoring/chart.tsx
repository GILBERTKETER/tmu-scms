import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import App from "@/app/(site)/api/api"
function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await App.get("/api/get-incidents-by-month/");
        if (response.data.success) {
          setData(response.data.data);
        } else {
          console.error("Failed to fetch data:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching incident data:", error);
      }
    };

    fetchIncidentData();
  }, []);

  return (
    <div className="mb-10" style={{ width: "100%" }}>
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Incident Reports (Monthly)
      </h2>
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} className="rounded bg-white">
            <Line type="monotone" dataKey="incidents" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
