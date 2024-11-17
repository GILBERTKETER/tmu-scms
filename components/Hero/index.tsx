"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
              <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
                Your one-stop solution for all university services, from
                academics to administration, designed to streamline and enhance
                your campus experience.{" "}
              </h4>
              <h1 className="mb-5 pr-16 text-3xl font-bold text-primary dark:text-white xl:text-hero ">
                Elevating Campus Life: Smart Campus Management
                {"   "}
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                  System
                </span>
              </h1>
              <p>
                A comprehensive platform that seamlessly integrates university
                services, enhancing collaboration and operational efficiency for
                students, faculty, and administration.
              </p>

              <div className="mt-10">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap gap-5">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="text"
                      placeholder="Enter your email address"
                      className="rounded-full border border-stroke px-6 py-2.5 shadow-solid-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"
                    />
                    <Button
                      type="outline"
                      aria-label="get started button"
                      className="flex rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                    >
                      Get Started
                    </Button>
                  </div>
                </form>

                <p className="mt-5 text-black dark:text-white">
                  Experience our services with no commitment.
                </p>
              </div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute -left-11.5 top-0"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className=" relative aspect-[700/444] w-full">
                  <Image
                    className="rounded-lg shadow-solid-l dark:hidden"
                    src="/images/hero/tmu.jpg"
                    alt="Hero"
                    fill
                  />
                  <Image
                    className="hidden rounded-lg shadow-solid-l dark:block"
                    src="/images/hero/tmu.jpg"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
