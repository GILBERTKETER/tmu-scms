import AttendanceCards from './AttendanceCards';
import ClassList from './ClassList'
import CheckInModal from './CheckInModal';

const AttendanceDashboard: React.FC = () => {
  return (
    <div className="h-[auto] bg-gray-100 p-2 space-y-6 mb-4">
      <h1 className="text-3xl text-primary font-bold mb-6">Attendance Dashboard</h1>
      
      {/* Attendance Overview Cards */}
      <AttendanceCards />

      {/* Check-In Modals for RFID/QR/Fingerprint */}
      <CheckInModal />
      {/* Class list*/}
      <ClassList />

    </div>
  );
};

export default AttendanceDashboard;
