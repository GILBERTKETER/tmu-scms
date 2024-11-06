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
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface TransformedEvent {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  date: string;
  isAllDay?: boolean;
}

function CalendarComponent() {
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
    defaultView: "month-grid",
    events: [],
    selectedDate: currentDate,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
    isDark: false,
  });

  const transformEvents = (events: Event[]): TransformedEvent[] => {
    const transformed = events.map((event) => {
      const startDateTime = new Date(`${event.date} ${event.start_time}`);
      const endDateTime = new Date(`${event.date} ${event.end_time}`);

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        isAllDay: false,
      };
    });
    console.log("Transformed events:", transformed); // Add this line
    return transformed;
  };

  // Fetch and process events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await App.get("/api/get-events/");
        const fetchedEvents = response.data;
        console.log("Fetched events:", fetchedEvents); // Add this line
        setRawEvents(fetchedEvents);

        const processed = transformEvents(fetchedEvents);
        console.log("Transformed events:", processed);

        setTransformedEvents(processed);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = async (eventId: number) => {
    console.log("Edit event with ID:", eventId);

    try {
      const response = await App.put("/api/edit-calendar-events/", { event: eventId });
      if (response.data.success) {
        toast.success(response.data.message || "Event updated successfully.");
        Swal.fire({
          icon: "success",
          title: "Event updated successfully.",
          text: response.data.message || "The event has been updated successfully.",
        });
      } else {
        toast.error(response.data.message || "An error occurred while updating.");
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.data.message || "There was a problem updating your event. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred during update.");
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "An unknown error occurred during update. Please try again.",
      });
    }
  };

  const handleDelete = async (eventId: number) => {
    try {
      const response = await App.delete("/api/delete-calendar-events/", {
        data: { eventId },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Event deleted successfully.");
        Swal.fire({
          icon: "success",
          title: "Event deleted successfully.",
          text: response.data.message || "The event has been deleted successfully.",
        });
      } else {
        toast.error(response.data.message || "An error occurred while deleting.");
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: response.data.message || "There was a problem deleting your event. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred during deletion.");
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: error.message || "An unknown error occurred during deletion. Please try again.",
      });
    }
  };

  const handleAddEvent = async (newEvent: Event) => {
    try {
      setRawEvents((prev) => [...prev, newEvent]);
      const updatedTransformed = transformEvents([...rawEvents, newEvent]);
      setTransformedEvents(updatedTransformed);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        Loading calendar...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex h-auto w-full items-center justify-end py-4">
        <EventManagement />
      </div>
      <div className="flex w-full items-center justify-start overflow-auto">
        <Timelines />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-[100%] lg:w-[50%]">
          <UpcomingEventsComponent
            events={rawEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="h-[auto] w-[100%] overflow-hidden rounded-lg bg-white shadow-lg lg:w-[50%]">
          <ScheduleXCalendar calendarApp={calendar} events={transformedEvents} />
        </div>
      </div>
    </>
  );
}

export default CalendarComponent;
