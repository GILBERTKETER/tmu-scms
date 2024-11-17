"use client"
import ClassSchedule from './ClassSchedule';
import UnscheduledClasses from './UnscheduledClasses';
import ScheduledActivities from './ScheduledActivities';
const Sheduler: React.FC = () => (
  <div className="min-h-screen shadow-sm">
    <h1 className="text-3xl font-bold mb-6 text-primary">Scheduling</h1>
    <ClassSchedule />
    <div className='mt-10 grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
      <UnscheduledClasses/>
      <ScheduledActivities/>
    </div>
  </div>
);

export default Sheduler;
