import React from "react";
import YearCards from "./YearCards";
import AdminTable from "./AdminTables";
import AddCourse from "./AddCourse"
import AddProgram from "./AddProgram"
function AdminSettings() {
  const Cards = [
    {
      title: "First Year",
      semester: 2,
      numberOfCourses: 33,
      EnrolledStudents: 24,
    },
    {
      title: "Second Year",
      semester: 2,
      numberOfCourses: 33,
      EnrolledStudents: 24,
    },
    {
      title: "Third Year",
      semester: 2,
      numberOfCourses: 33,
      EnrolledStudents: 24,
    },
    {
      title: "Fourth Year",
      semester: 2,
      numberOfCourses: 33,
      EnrolledStudents: 24,
    },
  ];
  return (
    <div className="mx-4  max-w-screen-xl sm:mx-8 xl:mx-auto">
      <div className="grid grid-cols-8 pb-10 pt-3 sm:grid-cols-10">
        <div className="col-span-12 rounded-xl sm:px-8">
           <div className="flex item-center justify-between"> 
          <div className="pt-4">
            <h1 className="py-2 text-2xl font-semibold">Course Management</h1>
            <p className="font- text-slate-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p></div>
            <div className="flex items-center justify-between gap-1">
              <AddCourse/>
              <AddProgram/>
            </div>
          </div>
          <hr className="mb-8 mt-4" />

          <div className="mb-10 grid gap-4 gap-y-8 lg:grid-cols-2 lg:gap-y-4">
            {Cards.map((card, index) => {
              return (
                <YearCards
                  key={index}
                  title={card.title}
                  semester={card.semester}
                  numberOfCourses={card.numberOfCourses}
                  EnrolledStudents={card.EnrolledStudents}
                />
              );
            })}
            {/* ==================== */}
          </div>

          <AdminTable />
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
