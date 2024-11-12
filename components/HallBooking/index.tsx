"use client";
import React, { useEffect, useState } from "react";
import HallManagement from "./HallManagement";
import Board from "./Board";
import App from "@/app/(site)/api/api";
import HallsDisplay from "./HallDetails";

interface Hall {
  id: number;
  hall_name: string;
  hall_number: string;
  hall_capacity: number;
  current_status: {
    status: 'Occupied' | 'Available';
    current_class: {
      course_name: string;
      course_code: string;
      end_time: string;
    } | null;
    next_class: {
      course_name: string;
      course_code: string;
      start_time: string;
    } | null;
  };
  weekly_schedule: {
    [key: string]: {
      schedules: Array<{
        start_time: string;
        end_time: string;
        course_name: string;
        course_code: string;
        enrollment_id: number;
      }>;
      total_classes: number;
    };
  };
}

interface HallData {
  halls: Hall[];
  current_day: string;
  current_time: string;
  success: boolean;
  message: string;
}

const Home: React.FC = () => {
  const [hallData, setHallData] = useState<HallData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHallData = async () => {
      try {
        setLoading(true);
        const response = await App.get('/api/hall-details/');
        setHallData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hall data');
        console.error('Error fetching hall data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHallData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hallData) return <div>No data available</div>;

  return (
    <div>
      <Board />
      <HallsDisplay
        halls={hallData.halls}
        currentDay={hallData.current_day}
        currentTime={hallData.current_time}
      />
      <HallManagement />
    </div>
  );
};

export default Home;