import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input, Space } from '@arco-design/web-react';
// You'll need to add this to your public folder
import markerIcon from './img/placeholder.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface Building {
  name: string;
  coordinates: [number, number];
}

const buildings: Building[] = [
  { name: 'Main Administration Block', coordinates: [-0.5422, 34.4564] },
  { name: 'Library', coordinates: [-0.5425, 34.4570] },
  { name: 'Science Complex', coordinates: [-0.5430, 34.4560] },
  { name: 'Student Center', coordinates: [-0.5428, 34.4568] },
  // Add more buildings as needed
];

// Fix for default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

function SetViewOnClick({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, 18);
  return null;
}
const InputSearch = Input.Search;

const FreeInteractiveTomMboyaUniversityMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [centerCoords, setCenterCoords] = useState<[number, number]>([-0.5422, 34.4564]);

  const handleSearch = () => {
    const foundBuilding = buildings.find(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (foundBuilding) {
      setCenterCoords(foundBuilding.coordinates);
    }
  };

  return (
    <div className="map-wrapper" style={{height:"auto"}}>
      <div className="search-bar">
      <InputSearch
        searchButton
        defaultValue='Tom Mboya University'
        placeholder='Enter location to search'
        style={{ width: "auto" }}
      />
      </div>
      <MapContainer center={[-0.5422, 34.4564]} zoom={16} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {buildings.map((building, index) => (
          <Marker key={index} position={building.coordinates}>
            <Popup>{building.name}</Popup>
          </Marker>
        ))}
        <SetViewOnClick coords={centerCoords} />
      </MapContainer>
      <style jsx>{`
        .map-wrapper {
          position: relative;
          height: 600px;
          width: 100%;
        }
        .search-bar {
          position: absolute;
          top: 10px;
          left: 50px;
          z-index: 1000;
          display: flex;
        }
        .search-input {
          padding: 8px;
          font-size: 16px;
          border: none;
          border-radius: 4px 0 0 4px;
        }
        .search-button {
          padding: 8px 16px;
          font-size: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }
        .search-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default FreeInteractiveTomMboyaUniversityMap;