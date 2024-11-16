import React, { useEffect, useState } from "react";
import YearCards from "./YearCards";
import AdminTable from "./AdminTables";
import AddCourse from "./AddCourse";
import AddProgram from "./AddProgram";
import App from "@/app/(site)/api/api";
import LoadingLayout from "../Layouts/LoadingLayout";
interface Card {
  year: string;
  numberOfCourses: number;
  semesters: string[];
  enrolledCount: number;
}
function AdminSettings() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const getProgramDetails = async () => {
      const response = await App.get("/api/program-details/");
      if (response.data.success) {
        const formattedCards: Card[] = Object.entries(response.data.data).map(
          ([year, details]: [string, any]) => ({
            year,
            numberOfCourses: details.number_of_courses,
            semesters: details.semesters,
            enrolledCount: details.enrolled_count,
          })
        );
        setCards(formattedCards);
      }
    };
    getProgramDetails();
  }, []);

  return (
    <LoadingLayout>
      <div className="mx-4 max-w-screen-xl sm:mx-8 xl:mx-auto">
        <div className="grid grid-cols-8 pb-10 pt-3 sm:grid-cols-10">
          <div className="col-span-12 rounded-xl sm:px-8">
            <div className="flex flex-col space-y-4 pt-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0">
              <h1 className="py-2 text-2xl font-semibold">Course Management</h1>
              <div className="flex items-center justify-between gap-1">
                <AddCourse />
                <AddProgram />
              </div>
            </div>
            <hr className="mb-8 mt-4" />

            <div className="mb-10 grid gap-4 gap-y-8 lg:grid-cols-2 lg:gap-y-4">
              {cards.map((card, index) => (
                <YearCards
                  key={index}
                  title={`Year ${card.year.split("_")[1]}`}
                  semester={card.semesters.join(", ")} // Join semesters array
                  numberOfCourses={card.numberOfCourses}
                  EnrolledStudents={card.enrolledCount}
                />
              ))}
            </div>

            <AdminTable />
          </div>
        </div>
      </div>
    </LoadingLayout>
  );
}

export default AdminSettings;
