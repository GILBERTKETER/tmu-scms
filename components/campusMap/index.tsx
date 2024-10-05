"use client"
import dynamic from 'next/dynamic';
import GoogleMapTm from "./googleMap"
const TomMboyaUniversityMap = dynamic(() => import('./mapComponent'), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tom Mboya University Map</h1>
      <div className="w-full">
        <TomMboyaUniversityMap />
        <GoogleMapTm/>
      </div>
    </div>
  );
};

export default Home;