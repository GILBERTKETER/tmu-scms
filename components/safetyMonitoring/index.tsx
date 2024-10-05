"use client";
import React, { useState } from "react";
import AddIncidentModal from "./IncidentModal";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ExclamationCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import Card from "./card";
import { Space } from "@arco-design/web-react";
import Charts from "./chart";
import IncidentsTable from "./incidentsTable";
import Alerts from "./alerts";

const SafetyPage = () => {
  interface CardData {
    title: string;
    content: string | number;
    contentClass: string;
  }

  const cardData: CardData[] = [
    {
      title: "Active Incidents",
      content: 3,
      contentClass: "text-red-500 text-3xl font-bold",
    },
    {
      title: "Total Incidents (This Month)",
      content: 12,
      contentClass: "text-blue-500 text-3xl font-bold",
    },
    {
      title: "Last Incident Date",
      content: "2024-10-03",
      contentClass: "text-gray-600 text-2xl",
    },
    {
      title: "Highest Severity",
      content: "High",
      contentClass: "text-red-600 text-2xl font-bold",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Safety Monitoring Dashboard
      </h1>

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

      <div className="flex justify-center space-x-4">
        <Alerts />
        <AddIncidentModal />
      </div>
    </div>
  );
};

export default SafetyPage;
