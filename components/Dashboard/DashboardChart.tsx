"use client"
import React from 'react';
import { Card } from '@arco-design/web-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const DashboardBarChart = () => {
  return (
    <Card
      title="Monthly Statistics"
      className="w-full h-full"
    >
      <div style={{height:"100% !important"}} className="h-[350px] w-full"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="rgb(var(--primary-6))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashboardBarChart;