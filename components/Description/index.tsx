import React from "react";
function Description() {
  return (
    <div className="relative overflow-hidden bg-extendlight pt-16 pb-32 space-y-24">
      <div className="relative ">
        <div className=" lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto sm:w-full w-xl sm:px-0px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
            <div>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-8 w-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    ></path>
                  </svg>
                </span>
              </div>

              <div className="mt-6">
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                  Personalized Career Counseling:
                </h2>
                <p className="mt-4 text-lg text-black dark:text-white">
                  Our career guidance system provides personalized career
                  counseling based on each individuals strengths, interests, and
                  goals. With a range of assessments and tailored feedback, we
                  help users discover the best career paths.
                </p>
                <div className="mt-6">
                  <a
                    className="inline-flex rounded-lg bg-secondary px-4 py-1.5 text-base font-semibold leading-7 text-primary shadow-sm ring-1 ring-secondary hover:bg-primary hover:text-white"
                    href="#"
                  >
                    SkillTrack: TMU Career Bot
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
              <img
                loading="lazy"
                width="647"
                height="486"
                className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                style={{ color: "transparent" }}
                src="/images/advisor/guiding.jpg"
                alt="Description of image" // You can add alt text for accessibility
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 lg:col-start-2">
            <div>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-8 w-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                    ></path>
                  </svg>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                  Career Insights and Trends:
                </h2>
                <p className="mt-4 text-lg dark:text-white text-black">
                  Stay informed with up-to-date industry insights, job market
                  trends, and career opportunities. Our system provides valuable
                  data to help users stay ahead and make informed decisions.
                </p>
                <div className="mt-6">
                  <a
                    className="inline-flex rounded-lg bg-secondary px-4 py-1.5 text-base font-semibold leading-7 text-primary shadow-sm ring-1 ring-secondary hover:bg-primary hover:text-white"
                    href="#"
                  >
                    FutureMentor
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
              <img
                alt="Career insights and trends"
                loading="lazy"
                width="647"
                height="486"
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                style={{ color: "transparent" }}
                src="/images/advisor/trends.svg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
            <div>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-8 w-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                    ></path>
                  </svg>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                  Mentorship and Networking:
                </h2>
                <p className="mt-4 text-lg text-black dark:text-white">
                  Connect with experienced professionals and mentors to gain
                  valuable advice and guidance. Our platform facilitates
                  networking opportunities to help users grow their professional
                  network.
                </p>
                <div className="mt-6">
                  <a
                    className="inline-flex rounded-lg bg-secondary px-4 py-1.5 text-base font-semibold leading-7 text-primary shadow-sm ring-1 ring-secondary hover:bg-primary hover:text-white"
                    href="#"
                  >
                    CareerCoach: TMU Edition
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
              <img
                alt=""
                loading="lazy"
                width="647"
                height="486"
                className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                style={{ color: "transparent" }}
                src="/images/advisor/connect.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;
