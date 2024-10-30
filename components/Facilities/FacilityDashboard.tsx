import React, { useEffect, useState } from 'react';
import { Card, Statistic, Grid } from '@arco-design/web-react';
import { IconHome, IconBook, IconThunderbolt } from '@arco-design/web-react/icon';
import App from "@/app/(site)/api/api"; // Adjust the import path as needed

const FacilityDashboard: React.FC = () => {
    const { Row, Col } = Grid;
    
    const [facilitySummary, setFacilitySummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await App.get("/api/get-all-facilities-count/"); // Adjust the endpoint if needed
                if (response.data.success) {
                    const data = response.data.type_counts; // Get the type counts from the response
                    const summary = Object.entries(data).map(([key, value]) => ({
                        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), // Format title
                        count: value.total,
                        icon: key === 'library' ? <IconBook /> : <IconThunderbolt />, // Add appropriate icons
                        available: value.available,
                        booked: value.booked,
                    }));
                    setFacilitySummary(summary);
                } else {
                    console.error("Failed to fetch facility counts:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching facilities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // You can add a loading spinner or skeleton here
    }

    return (
        <Row gutter={24}>
            {facilitySummary.map((facility, index) => (
                <Col className="border" style={{ width: "100%" }} key={index} span={6} xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title={facility.title}
                            value={facility.count}
                            suffix="Facilities"
                            icon={facility.icon}
                        />
                        <div className="flex justify-between mt-4">
                            <span>Available: {facility.available}</span>
                            <span>Booked: {facility.booked}</span>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default FacilityDashboard;
