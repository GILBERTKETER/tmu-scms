"use client"
import { Button, Tag } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
const Hero: React.FC = () => (
  <div className="relative z-[1] h-[80vh] overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
    <div className="absolute inset-0">
      <img
        height={400}
        style={{ width: "100vw" }}
        src="/images/advisor/bg.png"
        alt="Background Image"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-5xl font-bold leading-tight">
        Your Personalized Career Advisor
      </h1>
      <p className="mb-8 text-lg text-gray-300 lg:w-1/2">
        Welcome to your virtual career guide. I’m here to assist you in finding
        the right career path, preparing for opportunities, and offering
        tailored advice to help you succeed in your professional journey.
      </p>
      <Tag
        color="blue"
        className="transform rounded-full bg-yellow-400 px-6 py-2 text-lg font-semibold text-gray-900 transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-300 hover:shadow-lg"
      >
        Lets chat
      </Tag>
    </div>
  </div>
);

export default Hero;
