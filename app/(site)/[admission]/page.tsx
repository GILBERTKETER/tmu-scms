"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import App from "@/app/(site)/api/api";
import {
  IconEmail,
  IconHome,
  IconPhone,
  IconGithub,
} from "@arco-design/web-react/icon";
import Image from "next/image";
import Link from "next/link";
import { Message } from "@arco-design/web-react";
import Layout from "@/components/Layouts/homeLayout";
import "@arco-design/web-react/dist/css/arco.min.css";

export default function StudentProfile() {
  const pathname = usePathname();
  const admission = pathname?.split("/").pop();

  interface studentData {
    name: string;
    admission: string;
    email: string;
  }
  const [studentData, setStudentData] = useState<studentData>();
  const [loading, setLoading] = useState(true);
  interface PortfolioData {
    personalInfo: any;
    skills: string[];
    experiences: any[];
    education: any[];
    projects: any[];
    socialMedia: any[];
  }
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null,
  );

  const getImageUrl = (filename: any) => {
    if (!filename) return "/default-placeholder.png";
    const cleanFilename = filename.replace("filename=", "");
    return `https://ketercoder.pythonanywhere.com/media/${cleanFilename}`;
  };

  useEffect(() => {
    if (admission) {

      const getPortfolio = async () => {
        try {
          const response = await App.get(`/api/students/${admission}`);
          setPortfolioData(response.data.data);
        } catch (error: any) {
          Message.error("An error occurred: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      getPortfolio();
    }
  }, []);

  useEffect(() => {
    if (admission) {
      const fetchUserProfile = async () => {
        try {
          const response = await App.get(`/api/students/${admission}`);
          if (response.data.success) {
            setStudentData(response.data.user);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [admission]);

  if (loading || !portfolioData) return <p>Loading...</p>;
  const {
    personalInfo,
    skills,
    experiences,
    education,
    projects,
    socialMedia,
  } = portfolioData;

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          {/* Cover Image Section */}
          <div className="relative h-48 w-full bg-gray-100 md:h-64">
            {personalInfo.cover_image ? (
              <img
                src={getImageUrl(personalInfo.cover_image)}
                alt="profile cover"
                className="h-full w-full object-cover"
                onError={(e: any) => {
                  e.target.src = "/default-cover.jpg"; // Fallback image
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-gray-400">No cover image available</span>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-8">
            {/* Profile Image */}
            <div className="relative -mt-20 mb-6">
              <div className="relative mx-auto h-32 w-32">
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                  {personalInfo.profile_image ? (
                    <Image
                      src={getImageUrl(personalInfo.profile_image)}
                      width={128}
                      height={128}
                      className="object-cover"
                      alt="profile"
                      onError={(e: any) => {
                        e.target.src = "/default-avatar.jpg"; // Fallback image
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <span className="text-2xl text-gray-400">
                        {personalInfo.fullName?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rest of the component remains the same... */}
            {/* User Info */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {studentData?.name}
              </h1>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {studentData?.admission}
              </p>

              {/* Contact Info */}
              <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex flex-col items-center">
                  <IconPhone className="mb-2 text-primary" />
                  <span className="text-sm">{personalInfo.phone}</span>
                </div>
                <div className="flex flex-col items-center">
                  <IconEmail className="mb-2 text-primary" />
                  <span className="text-sm">{personalInfo.email}</span>
                </div>
                <div className="flex flex-col items-center">
                  <IconHome className="mb-2 text-primary" />
                  <span className="text-sm">{personalInfo.location}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                About Me
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {personalInfo.summary}
              </p>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Experience
              </h2>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {exp.company}
                  </p>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {edu.institution}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {edu.degree}
                  </p>
                  <p className="text-sm text-gray-500">Year {edu.year}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Projects
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 dark:border-gray-700"
                  >
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="mb-2 text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                    <p className="mb-2 text-sm text-primary">
                      {project.technologies}
                    </p>
                    <Link
                      href={project.link}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                    >
                      View Project →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Connect
              </h2>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    target="_blank"
                  >
                    {social.platform === "github" && (
                      <IconGithub className="h-6 w-6" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
