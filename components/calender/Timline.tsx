import React, { useEffect, useState } from 'react';
import { Chrono } from 'react-chrono';
import App from '@/app/(site)/api/api';

const Timeline: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await App.get('/api/get-events/'); 
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const items = events.map(event => {
        const formattedTime = new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = new Date(event.date).toLocaleDateString();

        return {
            title: formattedDate,
            cardTitle: event.title,
            cardSubtitle: `${formattedDate} at ${formattedTime}`,
            cardDetailedText: event.description
        };
    });

    if (loading) {
        return <div>Loading events...</div>;
    }

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
