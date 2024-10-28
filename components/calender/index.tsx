"use client";
import React, { useState, useEffect } from "react";
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
import EventManagement from "./AddEvents";
import Timelines from "./Timline";
import App from "@/app/(site)/api/api";

interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
}

interface TransformedEvent {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  isAllDay?: boolean;
}

function CalenderComponent() {
  const [rawEvents, setRawEvents] = useState<Event[]>([]);
  const [transformedEvents, setTransformedEvents] = useState<TransformedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toISOString().split("T")[0];

  // Create calendar configuration with monthly view as default
  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(),
      createViewDay(),
      createViewWeek(),
      createViewMonthAgenda(),
    ],
    defaultView: 'month-grid',
    events: [],
    selectedDate: currentDate,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
    dateFormat: {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    },
  });

  // Function to transform events into Schedule-X format
  const transformEvents = (events: Event[]): TransformedEvent[] => {
    return events.map(event => {
      // Ensure dates are valid
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        isAllDay: false,
      };
    }).filter(event => {
      // Filter out events with invalid dates
      return !isNaN(new Date(event.start).getTime()) && !isNaN(new Date(event.end).getTime());
    });
  };

  // Fetch and process events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await App.get('/api/get-events/');
        console.log('Raw API response:', response.data);

        const fetchedEvents = response.data;
        setRawEvents(fetchedEvents); // Store raw events for UpcomingEvents

        const processed = transformEvents(fetchedEvents);
        console.log('Transformed events:', processed);
        
        setTransformedEvents(processed);
        calendar.setEvents(processed);
        
        console.log('Calendar events set:', calendar.getEvents());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (eventId: number) => {
    console.log("Edit event with ID:", eventId);
  };

  const handleDelete = async (eventId: number) => {
    try {
      // Update both raw and transformed events
      const updatedRawEvents = rawEvents.filter(event => event.id !== eventId);
      setRawEvents(updatedRawEvents);

      const updatedTransformed = transformEvents(updatedRawEvents);
      setTransformedEvents(updatedTransformed);
      calendar.setEvents(updatedTransformed);

      // Optional: Delete from backend
      // await App.delete(`/api/events/${eventId}`);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Function to add new event
  const handleAddEvent = async (newEvent: Event) => {
    try {
      setRawEvents(prev => [...prev, newEvent]);
      const updatedTransformed = transformEvents([...rawEvents, newEvent]);
      setTransformedEvents(updatedTransformed);
      calendar.setEvents(updatedTransformed);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading calendar...</div>;
  }

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
          <UpcomingEventsComponent
            events={rawEvents} // Pass raw events to UpcomingEvents
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="w-[100%] overflow-hidden rounded-lg bg-white shadow-lg lg:w-[50%] h-[auto]">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </>
  );
}

export default CalenderComponent;