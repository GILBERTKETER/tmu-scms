import React, { useEffect, useState } from 'react';
import { Card, Statistic, Grid } from '@arco-design/web-react';
import { IconHome, IconBook, IconThunderbolt } from '@arco-design/web-react/icon';
import App from "@/app/(site)/api/api"; // Adjust the import path as needed

interface FacilitySummaryItem {
  title: string;
  count: number;
  icon: React.ReactNode;
  available: number;
  booked: number;
}

interface FacilityCounts {
  total: number;
  available: number;
  booked: number;
}

interface ApiResponse {
  success: boolean;
  type_counts: Record<string, FacilityCounts>;
  message?: string;
}

const FacilityDashboard: React.FC = () => {
  const { Row, Col } = Grid;
  const [facilitySummary, setFacilitySummary] = useState<FacilitySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await App.get<ApiResponse>("/api/get-all-facilities-count/"); 
        if (response.data.success) {
          const data = response.data.type_counts;
          const summary: FacilitySummaryItem[] = Object.entries(data).map(([key, value]) => ({
            title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), // Format title
            count: value.total,
            icon: key === 'library' ? <IconBook /> : key === 'home' ? <IconHome /> : <IconThunderbolt />, 
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
    <Grid.Row>
      {facilitySummary.map((facility, index) => (
        <Grid.Col span={8} key={index}>
          <Card>
            <Statistic title={facility.title} value={facility.count} />
            <div>
              Available: {facility.available}
              Booked: {facility.booked}
            </div>
          </Card>
        </Grid.Col>
      ))}
    </Grid.Row>
  );
};

export default FacilityDashboard;
