// components/MapComponent.tsx
import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';

interface Place {
  name: string;
  position: google.maps.LatLngLiteral;
  icon: string;
}

const places: Place[] = [
  { name: 'Computer Lab', position: { lat: -0.4855, lng: 34.7446 }, icon: '/icons/computer-lab-icon.png' },
  { name: 'Main Lab', position: { lat: -0.4860, lng: 34.7435 }, icon: '/icons/lab-icon.png' },
  { name: 'Clinic', position: { lat: -0.4858, lng: 34.7448 }, icon: '/icons/clinic-icon.png' },
  { name: 'Student Center', position: { lat: -0.4852, lng: 34.7432 }, icon: '/icons/student-center-icon.png' },
];

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: -0.4856, // Latitude of Tom Mboya University
  lng: 34.7445, // Longitude of Tom Mboya University
};

const MapComponent: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const onMapClick = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const calculateRoute = () => {
    if (!selectedPlace) return;

    const directionsService = new google.maps.DirectionsService();
    const request: google.maps.DirectionsRequest = {
      origin: places[0].position, // Starting point (Computer Lab in this case)
      destination: selectedPlace.position, // Destination point based on clicked marker
      travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirectionsResponse(result);
      } else {
        console.error(`Error fetching directions ${status}`);
      }
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
      onClick={onMapClick}
    >
      {places.map((place) => (
        <Marker
          key={place.name}
          position={place.position}
          icon={place.icon}  // Custom marker icons
          onClick={() => handleMarkerClick(place)}
        />
      ))}

      {selectedPlace && (
        <InfoWindow
          position={selectedPlace.position}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div>
            <h4>{selectedPlace.name}</h4>
            <button onClick={calculateRoute}>Get Directions</button>
          </div>
        </InfoWindow>
      )}

      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
