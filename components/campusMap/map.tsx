import React from "react";
import { Card, Typography, Space, Tag } from "@arco-design/web-react";
import { IconLocation } from "@arco-design/web-react/icon";

const { Title } = Typography;

const MapComponent = () => {
  const locations = [
    {
      id: 1,
      name: "Tom Mboya University",
      description: "Main Campus",
      coordinates: "-0.5313435, 34.4639929",
    },
    {
      id: 2,
      name: "University Hostel",
      description: "Student Accommodation",
      coordinates: "-0.5313435, 34.4639929",
    },
  ];

  return (
    <Card
      className="map-container"
      title={
        <Space>
          <IconLocation style={{ color: "rgb(var(--primary-6))" }} />
          <Title heading={5} style={{ margin: 0 }}>
            Tom Mboya University
          </Title>
        </Space>
      }
      headerStyle={{ background: "var(--color-bg-2)" }}
    >
      <div className="relative w-full">
        <div className="map-frame-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15958.587026433988!2d34.4639929!3d-0.5313435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d4d4560903a9c5%3A0xb5c155ec5b42c331!2sTom%20Mboya%20University!5e0!3m2!1sen!2ske!4v1730866303712!5m2!1sen!2ske"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map-frame"
          />
        </div>

        {/* <Card
          className="legend-card"
          size="small"
          title="Key Locations"
          style={{
            position: "relative",
            display:"flex",
            
            width: "280px",
            background: "var(--color-bg-2)",
            boxShadow: "var(--shadow-2)",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {locations.map((location) => (
              <div key={location.id} className="location-item">
                <Space align="start">
                  <img
                    src="https://static-00.iconduck.com/assets.00/map-marker-icon-342x512-gd1hf1rz.png"
                    alt="marker"
                    style={{ width: 24, height: 24, marginTop: 4 }}
                  />
                  <div>
                    <Typography.Text>{location.name}</Typography.Text>
                    <Typography.Text
                      type="secondary"
                      style={{ display: "block", fontSize: 12 }}
                    >
                      {location.description}
                    </Typography.Text>
                    <Tag size="small" color="arcoblue">
                      {location.coordinates}
                    </Tag>
                  </div>
                </Space>
              </div>
            ))}
          </Space>
        </Card> */}

        <Tag
          color="arcoblue"
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            background: "var(--color-bg-2)",
          }}
        >
          © Google Maps
        </Tag>
      </div>

      <style jsx>{`
        .map-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .map-frame-container {
          position: relative;
          width: 100%;
          height: 600px;
        }
        .map-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .location-item {
          padding: 8px 0;
          border-bottom: 1px solid var(--color-border);
        }
        .location-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </Card>
  );
};

export default MapComponent;
