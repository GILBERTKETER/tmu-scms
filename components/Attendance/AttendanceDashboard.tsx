import AttendanceCards from './AttendanceCards';
import AttendanceLogs from './AttendanceLogs';
import CheckInModal from './CheckInModal';

const AttendanceDashboard: React.FC = () => {
  return (
    <div className="h-[auto] bg-gray-100 p-2 space-y-6 mb-4">
      <h1 className="text-3xl text-primary font-bold mb-6">Attendance Dashboard</h1>
      
      {/* Attendance Overview Cards */}
      <AttendanceCards />

      {/* Attendance Logs */}
      <AttendanceLogs />

      {/* Check-In Modals for RFID/QR/Fingerprint */}
      <CheckInModal />
    </div>
  );
};

export default AttendanceDashboard;
