import App from "@/app/(site)/api/api";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/Auth";

const DashboardCard = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({});
  useEffect(() => {
    console.log("useEffect is triggered");
    const getStats = async () => {
      console.log("Fetching data...");
      if (
        user?.role === "student" ||
        user?.role === "Student" ||
        user?.role === "classrep" ||
        user?.role === "Classrep"
      ) {
        const response = await App.get("/api/student/statscards/");
        console.log("Response:", response);
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } else if (user?.role === "lecturer" || user?.role === "Lecturer") {
        const response = await App.get("/api/lecturer/statscards/");
        console.log("Response:", response);
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } else if (user?.role === "admin" || user?.role === "Admin") {
        const response = await App.get("/api/admin/statscards/");
        console.log("Response:", response);
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } else {
        setUserStats("");
      }
    };
    getStats();
  }, [user]);
  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
      <div className="flex h-full items-center justify-between rounded-md bg-light p-4 shadow">
        <div>
          <h6 className="text-lg font-semibold uppercase leading-none tracking-wider text-secondary">
            {userStats?.title1}
          </h6>
          <span className="text-sm font-medium">
            {user?.role?.toLowerCase() === "admin" ? (
              <p>{userStats?.student_count + " students"}</p>
            ) : user?.role?.toLowerCase() === "student" ||
              user?.role?.toLowerCase() === "classrep" ? (
              userStats?.upcoming_class ? (
                <div className="flex items-center justify-start gap-4 pt-2">
                  <p className="text-primary">
                    Unit:{" "}
                    {userStats?.upcoming_class?.course_name +
                      " " +
                      userStats?.upcoming_class?.course_code}
                  </p>
                  <p className="text-primary">
                    Time:{" "}
                    {userStats?.upcoming_class?.start_time +
                      " at " +
                      userStats?.upcoming_class?.location || "Null"}
                  </p>
                </div>
              ) : (
                "No Upcoming Classes"
              )
            ) : user?.role?.toLowerCase() === "lecturer" ? (
              userStats?.upcoming_class ? (
                <div className="flex items-center justify-start gap-4 pt-2">
                  <p className="text-primary">
                    Unit:{" "}
                    {userStats?.upcoming_class?.course_name +
                      " " +
                      userStats?.upcoming_class?.course_code}
                  </p>
                  <p className="text-primary">
                    Time:{" "}
                    {userStats?.upcoming_class?.start_time +
                      " at " +
                      userStats?.upcoming_class?.location || "Null"}
                  </p>
                </div>
              ) : (
                "No Upcoming Classes"
              )
            ) : (
              "No Data"
            )}
          </span>
        </div>
        <div>
          {user?.role == "Admin" || user?.role == "admin" ? (
            <span>
              <svg
                height={36}
                width={36}
                className="h-12 w-12 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="#22409a"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </span>
          ) : (
            <svg
              height={36}
              width={36}
              viewBox="0 0 20 20"
              id="meteor-icon-kit__solid-books"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1 4H5C5.55228 4 6 4.44772 6 5V19C6 19.5523 5.55228 20 5 20H1C0.44772 20 0 19.5523 0 19V5C0 4.44772 0.44772 4 1 4zM2 13V17C2 17.5523 2.44772 18 3 18C3.55228 18 4 17.5523 4 17V13C4 12.4477 3.55228 12 3 12C2.44772 12 2 12.4477 2 13zM8 0H12C12.5523 0 13 0.44772 13 1V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V1C7 0.44772 7.44772 0 8 0zM9 11V17C9 17.5523 9.4477 18 10 18C10.5523 18 11 17.5523 11 17V11C11 10.4477 10.5523 10 10 10C9.4477 10 9 10.4477 9 11zM15 2H19C19.5523 2 20 2.44772 20 3V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V3C14 2.44772 14.4477 2 15 2zM16 15V17C16 17.5523 16.4477 18 17 18C17.5523 18 18 17.5523 18 17V15C18 14.4477 17.5523 14 17 14C16.4477 14 16 14.4477 16 15z"
                  fill="#22409a"
                ></path>
              </g>
            </svg>
          )}
        </div>
      </div>

      <div className="flex h-full items-center justify-between rounded-md bg-light p-4 shadow">
        <div>
          <h6 className="text-lg font-semibold uppercase leading-none tracking-wider text-gray-500 text-secondary">
            {userStats?.title2}
          </h6>
          <span className="text-sm font-medium text-primary">
            {user?.role?.toLowerCase() === "admin" ? (
              <p>{userStats?.lecturer_count + " lecturers"}</p>
            ) : user?.role?.toLowerCase() === "student" ||
              user?.role?.toLowerCase() === "classrep" ? (
              <p>{"Attended" + " " + userStats?.attendance_percentage + "%"}</p>
            ) : user?.role?.toLowerCase() === "lecturer" ? (
              <p>{"Attended" + " " + userStats?.attendance_percentage + "%"}</p>
            ) : (
              "No Data"
            )}
          </span>
        </div>
        <div>
          {user?.role == "admin" || user?.role == "Admin" ? (
            <span>
              <svg
                height={36}
                width={36}
                fill="#22409a"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 31.178 31.178"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <g>
                      {" "}
                      <circle cx="5.042" cy="5.721" r="3.866"></circle>{" "}
                      <path d="M30.779,6.78h-9.346V5.722h-2.479V6.78h-8.877H9.446v1.275h0.631v2.806l-1.452-0.692H6.449l-1.474,1.709l-1.426-1.709 l-3.133,0.582l-0.2,6.949h1.328l0.072,1.443h0.202v0.879v0.649v6.884H1.551L0,27.893v1.43h1.321l1.542-0.251l0.014,0.251h1.708 v-1.593v-0.173v-6.883h0.973v6.883v0.173v1.593h1.708l0.014-0.251l1.542,0.251h1.321v-1.43L8.59,27.557H8.325v-6.883v-0.65v-0.879 H8.57l0.316-6.4l1.191,0.539v7.355h9.136v2.343l-5.042,5.688h1.812l3.404-3.844v3.844h1.041v-3.84l3.399,3.84h1.841l-5.07-5.688 v-2.343h10.182V8.056h0.398V6.78H30.779z M29.887,19.7h-9.291h-1.383H10.97v-6.013l3.717,1.682l-0.014-2.317l-3.703-1.765V8.056 h18.917V19.7z"></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
            </span>
          ) : (
            <span>
              <svg
                height={36}
                width={36}
                fill="#22409a"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 256 173"
                enable-background="new 0 0 256 173"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g id="shopping_cart"> </g>{" "}
                  <path d="M128.253,56.864c15.186,0,27.432-12.247,27.432-27.432S143.536,2,128.253,2 c-15.186,0-27.432,12.247-27.432,27.432C100.918,44.716,113.165,56.864,128.253,56.864z M64.571,136.32h-49.28 c-15.969,0-16.851-24.395,0.294-24.395H58.3l24.493-36.054c7.25-9.895,15.48-14.598,27.138-14.598h36.544 c11.659,0,19.888,4.311,27.138,14.598l24.591,36.054h43.01c17.243,0,16.165,24.395,0.588,24.395h-49.28 c-3.919,0-8.622-1.372-11.365-5.584l-18.811-26.844l-0.098,67.209H94.844l-0.098-67.209l-18.811,26.844 C73.192,134.85,68.49,136.32,64.571,136.32z"></path>{" "}
                  <circle cx="207.5" cy="88.5" r="13.5"></circle>{" "}
                  <circle cx="35.5" cy="88.5" r="13.5"></circle>{" "}
                  <circle cx="240.5" cy="88.5" r="13.5"></circle>{" "}
                  <circle cx="224.5" cy="57.5" r="13.5"></circle>{" "}
                  <g id="cross"> </g> <g id="leaf"> </g>{" "}
                </g>
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="flex h-full items-center justify-between rounded-md bg-light p-4 shadow">
        <div>
          <h6 className="text-lg font-semibold uppercase leading-none tracking-wider text-gray-500 text-secondary">
            {userStats?.title3}
          </h6>
          <span className="text-sm font-medium text-primary">
            {user?.role?.toLowerCase() === "admin" ? (
              <p>{userStats?.admin_count + " Administrators"}</p>
            ) : user?.role?.toLowerCase() === "student" ||
              user?.role?.toLowerCase() === "classrep" ? (
              <p>{userStats?.enrolled_courses_count + " courses enrolled."}</p>
            ) : user?.role?.toLowerCase() === "lecturer" ? (
              <p>{userStats?.scheduled_classes_count + " classes."}</p>
            ) : (
              "No Data"
            )}
          </span>
        </div>
        <div>
          {user?.role == "admin" || user?.role == "Admin" ? (
            <>
              {" "}
              <span>
                <svg
                  height={36}
                  width={36}
                  fill="#22409a"
                  viewBox="0 0 1920 1920"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M276.941 440.584v565.722c0 422.4 374.174 625.468 674.71 788.668l8.02 4.292 8.131-4.292c300.537-163.2 674.71-366.268 674.71-788.668V440.584l-682.84-321.657L276.94 440.584Zm682.73 1479.529c-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0l739.313 348.2c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889Zm467.158-547.652h-313.412l-91.595-91.482v-83.803H905.041v-116.78h-83.69l-58.503-58.504c-1.92.113-3.84.113-5.76.113-176.075 0-319.285-143.21-319.285-319.285 0-176.075 143.21-319.398 319.285-319.398 176.075 0 319.285 143.323 319.285 319.398 0 1.92 0 3.84-.113 5.647l350.57 350.682v313.412Zm-266.654-112.941h153.713v-153.713L958.462 750.155l3.953-37.27c1.017-123.897-91.595-216.621-205.327-216.621S550.744 588.988 550.744 702.72c0 113.845 92.612 206.344 206.344 206.344l47.21-5.309 63.811 63.7h149.873v116.78h116.781v149.986l25.412 25.299Zm-313.4-553.57c0 46.758-37.949 84.706-84.706 84.706-46.758 0-84.706-37.948-84.706-84.706s37.948-84.706 84.706-84.706c46.757 0 84.706 37.948 84.706 84.706"
                      fill-rule="evenodd"
                    ></path>{" "}
                  </g>
                </svg>
              </span>
            </>
          ) : (
            <span>
              {" "}
              <svg
                height={36}
                width={36}
                viewBox="0 0 48 48"
                version="1"
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 48 48"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g fill="#fcb815">
                    {" "}
                    <rect x="9" y="20" width="30" height="13"></rect>{" "}
                    <ellipse cx="24" cy="33" rx="15" ry="6"></ellipse>{" "}
                  </g>{" "}
                  <path
                    fill="#22409a"
                    d="M23.1,8.2L0.6,18.1c-0.8,0.4-0.8,1.5,0,1.9l22.5,9.9c0.6,0.2,1.2,0.2,1.8,0l22.5-9.9c0.8-0.4,0.8-1.5,0-1.9 L24.9,8.2C24.3,7.9,23.7,7.9,23.1,8.2z"
                  ></path>{" "}
                  <g fill="#fcb815">
                    {" "}
                    <path d="M43.2,20.4l-20-3.4c-0.5-0.1-1.1,0.3-1.2,0.8c-0.1,0.5,0.3,1.1,0.8,1.2L42,22.2V37c0,0.6,0.4,1,1,1 s1-0.4,1-1V21.4C44,20.9,43.6,20.5,43.2,20.4z"></path>{" "}
                    <circle cx="43" cy="37" r="2"></circle>{" "}
                    <path d="M46,40c0,1.7-3,6-3,6s-3-4.3-3-6s1.3-3,3-3S46,38.3,46,40z"></path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="flex h-full items-center justify-between rounded-md bg-light p-4 shadow">
        <div>
          <h6 className="text-lg font-semibold uppercase leading-none tracking-wider text-gray-500 text-secondary">
            {userStats?.title4}
          </h6>
          <div className="text-sm font-medium text-primary">
            {user?.role?.toLowerCase() === "admin" ||
            user?.role?.toLowerCase() === "student" ||
            user?.role?.toLowerCase() === "lecturer" ||
            user?.role?.toLowerCase() === "classrep" ? (
              userStats?.upcoming_event ? (
                <div>
                  <p>{"Title: " + userStats?.upcoming_event?.event_name}</p>
                  <p>{"Date: " + userStats?.upcoming_event?.event_date}</p>
                  <p>
                    {"Address: " + userStats?.upcoming_event?.event_location ||
                      "None"}
                  </p>
                </div>
              ) : (
                "No Upcoming Events"
              )
            ) : (
              "No Data"
            )}
          </div>
        </div>
        <div>
          <svg
            height={36}
            width={36}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7 2a1 1 0 0 0-1 1v1.001c-.961.014-1.34.129-1.721.333a2.272 2.272 0 0 0-.945.945C3.116 5.686 3 6.09 3 7.205v10.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h11.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926V7.205c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945C19.34 4.13 18.961 4.015 18 4V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1zM5 9v8.795c0 .427.019.694.049.849.012.06.017.074.049.134a.275.275 0 0 0 .124.125c.06.031.073.036.134.048.155.03.422.049.849.049h11.59c.427 0 .694-.019.849-.049a.353.353 0 0 0 .134-.049.275.275 0 0 0 .125-.124.353.353 0 0 0 .048-.134c.03-.155.049-.422.049-.849L19.004 9H5zm8.75 4a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5z"
                fill="#22409a"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
