import React from "react";
interface CardTypes {
  title: string;
  semester: string;
  numberOfCourses: number;
  EnrolledStudents: number;
}

const YearCards: React.FC<CardTypes> = ({
  title,
  semester,
  numberOfCourses,
  EnrolledStudents,
}) => {
  return (
    <div className="space-y-8">
      <div className="">
        <div className="flex justify-between">
          <p className="mb-1 font-medium">
            Year: <strong className="text-secondary">{title}</strong>
          </p>
        </div>
        <div className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex w-full flex-col">
            <div className="mb-1 flex justify-between text-lg font-medium">
              <p className="font-bold text-primary">Semester:</p>
              <p className="text-secondary">{semester}</p>
            </div>
            <div className="mb-1 flex justify-between text-lg font-medium">
              <p className="font-bold text-primary">Number of Courses:</p>
              <p className="text-secondary">{numberOfCourses}</p>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <p className="font-bold text-primary">Enrolled Students:</p>
              <p className="text-secondary">{EnrolledStudents}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearCards;
