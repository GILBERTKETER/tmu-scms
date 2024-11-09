"use client";
import React, { useEffect, useState } from "react";
import AddIncidentModal from "./IncidentModal";
import { Space } from "@arco-design/web-react";
import Charts from "./chart";
import IncidentsTable from "./incidentsTable";
import Alerts from "./alerts";
import App from "@/app/(site)/api/api";
import Card from "./card";
import { useAuth } from "@/context/Auth";
const SafetyPage = () => {
  const { user } = useAuth();
  interface CardData {
    title: string;
    content: string | number;
    contentClass: string;
  }

  const [cardData, setCardData] = useState<CardData[]>([
    {
      title: "Active Incidents",
      content: 0,
      contentClass: "text-red-500 text-3xl font-bold",
    },
    {
      title: "Total Incidents (This Month)",
      content: 0,
      contentClass: "text-blue-500 text-3xl font-bold",
    },
    {
      title: "Last Incident Date",
      content: "N/A",
      contentClass: "text-gray-600 text-2xl",
    },
    {
      title: "Highest Severity",
      content: "N/A",
      contentClass: "text-red-600 text-2xl font-bold",
    },
  ]);

  useEffect(() => {
    const fetchIncidentSummary = async () => {
      try {
        const response = await App.get("/api/incident-summary/");
        if (response.data && response.data.success) {
          const {
            active_incidents_count,
            total_incidents_this_month,
            last_incident_date,
            highest_severity,
          } = response.data;

          const formattedLastIncidentDate = last_incident_date
            ? new Date(last_incident_date).toISOString().split("T")[0]
            : "N/A";

          setCardData([
            {
              title: "Active Incidents",
              content: active_incidents_count,
              contentClass: "text-red-500 text-3xl font-bold",
            },
            {
              title: "Total Incidents (This Month)",
              content: total_incidents_this_month,
              contentClass: "text-blue-500 text-3xl font-bold",
            },
            {
              title: "Last Incident Date",
              content: formattedLastIncidentDate,
              contentClass: "text-gray-600 text-2xl",
            },
            {
              title: "Highest Severity",
              content: highest_severity || "N/A",
              contentClass: "text-red-600 text-2xl font-bold",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching incident summary:", error);
      }
    };

    fetchIncidentSummary();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <div className="flex justify-between">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
          Safety Monitoring Dashboard
        </h1>
        {user?.role == "student" || user?.role == "classrep" ? null : (
          <AddIncidentModal />
        )}
      </div>

      <Space
        className="flex-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            content={card.content}
            contentclass={card.contentClass}
          />
        ))}
      </Space>

      <Charts />
      <IncidentsTable />
    </div>
  );
};

export default SafetyPage;
