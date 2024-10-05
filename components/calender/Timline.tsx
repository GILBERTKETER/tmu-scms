import React from 'react';
import { Chrono } from 'react-chrono';

const Timeline: React.FC = () => {
    const events = [
        {
            date: "2024-01-01",
            time: "10:00:00",
            description: "New Year's Event",
            long_description: "Celebration of the New Year with a grand event."
        },
        {
            date: "2024-02-14",
            time: "18:00:00",
            description: "Valentine's Day Party",
            long_description: "A special party for couples celebrating Valentine's Day."
        },
        {
            date: "2024-07-04",
            time: "12:00:00",
            description: "Independence Day",
            long_description: "Commemorating the independence of the country with parades and fireworks."
        },
        {
            date: "2024-03-17",
            time: "14:00:00",
            description: "St. Patrick's Day Parade",
            long_description: "Join us for the annual St. Patrick's Day parade and celebration."
        },
        {
            date: "2024-04-22",
            time: "09:00:00",
            description: "Earth Day Clean-Up",
            long_description: "Volunteer for our community clean-up event to celebrate Earth Day."
        },
        {
            date: "2024-05-05",
            time: "16:00:00",
            description: "Cinco de Mayo Festival",
            long_description: "Celebrate Cinco de Mayo with a festival full of food, music, and dancing."
        },
        {
            date: "2024-06-21",
            time: "19:00:00",
            description: "Summer Solstice Party",
            long_description: "A fun outdoor event to welcome the longest day of the year."
        },
        {
            date: "2024-08-31",
            time: "11:00:00",
            description: "Labor Day Weekend BBQ",
            long_description: "Kick off the Labor Day weekend with a family-friendly BBQ."
        },
        {
            date: "2024-09-22",
            time: "13:00:00",
            description: "Autumn Equinox Celebration",
            long_description: "Mark the beginning of fall with our Autumn Equinox Celebration."
        },
        {
            date: "2024-10-31",
            time: "20:00:00",
            description: "Halloween Costume Party",
            long_description: "Wear your best costume and join us for a spooky night of fun."
        },
        {
            date: "2024-11-25",
            time: "08:00:00",
            description: "Thanksgiving Food Drive",
            long_description: "Help those in need by donating to our Thanksgiving food drive."
        },
        {
            date: "2024-12-24",
            time: "17:00:00",
            description: "Christmas Eve Caroling",
            long_description: "Join us for an evening of Christmas caroling through the neighborhood."
        },
        {
            date: "2024-12-31",
            time: "23:59:00",
            description: "New Year's Eve Countdown",
            long_description: "Ring in the new year with our countdown party and fireworks."
        },
        {
            date: "2024-07-15",
            time: "08:00:00",
            description: "Charity Fun Run",
            long_description: "A 5K fun run to raise funds for local charities."
        },
        {
            date: "2024-11-11",
            time: "10:00:00",
            description: "Veterans Day Parade",
            long_description: "Honor our veterans with a special parade and ceremony."
        }
    ];
    

    const items = events.map(event => {
        const formattedTime = new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = new Date(event.date).toLocaleDateString(); 

        return {
            title: formattedDate,
            cardTitle: event.description,
            cardSubtitle: `${formattedDate} at ${formattedTime}`, 
            cardDetailedText: event.long_description
        };
    });

    return (
        <div style={{ width: "100%", height: "auto", zIndex: "10" }}>
            <Chrono 
                items={items} 
                mode="HORIZONTAL"
                theme={{
                    primary: "#22409a", 
                    secondary: "#fcb815", 
                    titleColor: "#22409a"
                  }}
            />
        </div>
    );
};

export default Timeline;
