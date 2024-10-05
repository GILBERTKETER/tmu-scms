"use client";
import React, { useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/calendar.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import UpcomingEventsComponent from "./UpcomingEventsComponent";
import { IconPlus } from "@arco-design/web-react/icon";
import { Button, Popover } from "@arco-design/web-react";
import EventManagement from "./AddEvents";
import Timelines from "./Timline";
interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
}

function CalenderComponent() {
  const currentDate = new Date().toISOString().split("T")[0];

  const initialEvents: Event[] = [
    {
      id: 1,
      title: "My new event",
      start: "2024-10-03T00:00:00",
      end: "2024-10-03T02:00:00",
      description: "My new event on this day",
    },
    {
      id: 2,
      title: "My new event",
      start: "2024-10-03T00:00:00",
      end: "2024-10-03T02:00:00",
      description: "My new event on this day",
    },
    {
      id: 3,
      title: "My new event",
      start: "2024-10-03T00:00:00",
      end: "2024-10-03T02:00:00",
      description: "My new event on this day",
    },
  ];

  const [events, setEvents] = useState<Event[]>(initialEvents);

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events,
    selectedDate: currentDate,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  const handleEdit = (eventId: number) => {
    console.log("Edit event with ID:", eventId);
  };

  const handleDelete = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
  };

  return (
    <>
      <div className="flex h-auto w-full items-center justify-end py-4">
        <EventManagement />
      </div>
      <div className="flex w-full items-center justify-start overflow-auto">
        <Timelines />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-[100%] lg:w-[50%]">
          {" "}
          <UpcomingEventsComponent
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="w-[100%] overflow-hidden rounded-lg bg-white shadow-lg lg:w-[50%]">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </>
  );
}

export default CalenderComponent;
