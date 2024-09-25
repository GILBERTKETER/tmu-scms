"use client";
import Link from "next/link";

const SidebarLink = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <li className="block">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex w-full rounded-sm px-3 py-2 text-base text-black dark:text-white ${activeTab === 'classes' ? 'bg-stroke dark:bg-black' : ''}`}
        >
          Book Classes
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex w-full rounded-sm px-3 py-2 text-base text-black dark:text-white ${activeTab === 'rooms' ? 'bg-stroke dark:bg-black' : ''}`}
        >
          Book Rooms
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          className={`flex w-full rounded-sm px-3 py-2 text-base text-black dark:text-white ${activeTab === 'facilities' ? 'bg-stroke dark:bg-black' : ''}`}
        >
          Book Facilities
        </button>
      </li>
    </>
  );
};

export default SidebarLink;
