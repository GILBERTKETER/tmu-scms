import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/Auth";
import { Message } from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
import { IconEmail, IconHome, IconPhone, IconGithub } from "@arco-design/web-react/icon";

interface PersonalInfo {
  fullName: string;
  cover_image: string | null;
  profile_image: string | null;
  phone: string;
  email: string;
  location: string;
  summary: string;
}

interface Experience {
  position: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface SocialMedia {
  platform: string;
  url: string;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  socialMedia: SocialMedia[];
}

function Profile() {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (filename: string | null) => {
    if (!filename) return "/default-placeholder.png";
    const cleanFilename = filename.replace("filename=", "");
    return `https://ketercoder.pythonanywhere.com/media/${cleanFilename}`;
  };

  useEffect(() => {
    const getPortfolio = async () => {
      try {
        const response = await App.get("/api/portfolio/get/");
        setPortfolioData(response.data.data);
      } catch (error: any) {
        Message.error("An error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    getPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">Failed to load profile data</p>
      </div>
    );
  }

  const { personalInfo, skills, experiences, education, projects, socialMedia } = portfolioData;

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="shadow-lg rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="relative h-48 md:h-64 w-full bg-gray-100">
          {personalInfo.cover_image ? (
            <img
              src={getImageUrl(personalInfo.cover_image)}
              alt="profile cover"
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/default-cover.jpg";
                target.onerror = null;
              }}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No cover image available</span>
            </div>
          )}
        </div>

        <div className="px-6 pb-8">
          <div className="relative -mt-20 mb-6">
            <div className="w-32 h-32 mx-auto relative">
              <div className="rounded-full border-4 border-white shadow-lg overflow-hidden h-full w-full bg-gray-100">
                {personalInfo.profile_image ? (
                  <Image
                    src={getImageUrl(personalInfo.profile_image)}
                    width={128}
                    height={128}
                    className="object-cover"
                    alt="profile"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.jpg";
                      target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">
                      {personalInfo.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {personalInfo.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.admission}</p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <IconPhone className="text-primary mb-2" />
                <span className="text-sm">{personalInfo.phone}</span>
              </div>
              <div className="flex flex-col items-center">
                <IconEmail className="text-primary mb-2" />
                <span className="text-sm">{personalInfo.email}</span>
              </div>
              <div className="flex flex-col items-center">
                <IconHome className="text-primary mb-2" />
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About Me</h2>
            <p className="text-gray-600 dark:text-gray-400">{personalInfo.summary}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Experience</h2>
            {experiences.map((exp, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className="font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className="font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
                <p className="text-gray-600 dark:text-gray-400">{edu.degree}</p>
                <p className="text-sm text-gray-500">Year {edu.year}</p>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{project.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                  <p className="text-sm text-primary mb-2">{project.technologies}</p>
                  <Link
                    href={project.link}
                    className="text-primary hover:underline text-sm"
                    target="_blank"
                  >
                    View Project →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Connect</h2>
            <div className="flex gap-4">
              {socialMedia.map((social, index) => (
                <Link key={index} href={social.url} target="_blank">
                  <IconGithub className="text-2xl text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
