"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

interface StudentProfile {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  college: string;
  photo: string;
}

const StudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>({
    firstname: "John",
    lastname: "Doe",
    email: "student@example.com",
    mobile: "123-456-7890",
    college: "Example University",
    photo: "https://via.placeholder.com/150",
  });

  const [originalProfile, setOriginalProfile] =
    useState<StudentProfile>(profile);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(JSON.stringify(profile) !== JSON.stringify(originalProfile));
  }, [profile, originalProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSave = () => {
    setOriginalProfile(profile);
    alert("Changes saved!");
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full sm:h-screen mt-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-6 mt-6 text-center sm:text-left text-gray-900 dark:text-gray-100">
            Student Profile
          </h1>
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 items-center sm:items-start">
            <div className="shrink-0">
              <Image
                src={profile?.photo}
                width={144}
                height={144}
                alt="Student Photo"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
                // priority // Add this if it's above the fold content
              />
            </div>
            <label className="flex flex-col w-full text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-200">
              <span>Name</span>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <input
                  type="text"
                  name="firstname"
                  value={profile.firstname}
                  onChange={handleChange}
                  className="mt-1 block w-full sm:w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:ring-3 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
                <input
                  type="text"
                  name="lastname"
                  value={profile.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full sm:w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:ring-3 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </label>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email:
              <input
                type="email"
                name="email"
                value={profile.email}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-200 cursor-not-allowed"
              />
            </label>
          </div>
          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Mobile:
              <input
                type="text"
                name="mobile"
                value={profile.mobile}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:ring-3 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </label>
          </div>
          {/* College */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              College:
              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:ring-3 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className={`mt-4 px-4 py-2 w-full sm:w-auto text-white rounded-md ${
              isChanged
                ? "bg-lime-900 hover:bg-lime-600 dark:bg-lime-700 dark:hover:bg-lime-500"
                : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
