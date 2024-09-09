"use client";
import React, { useState } from "react";
import { Sun, Moon, Bell, Menu } from "lucide-react";
import Image from "next/image";
import downloadicon from "../public/downloadicon.svg";
const Sidebar = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  isOpen,
  setIsOpen,
}) => {
  const tabs = ["Dashboard", "Activity", "Schedule", "Setting"];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 transition duration-200 ease-in-out lg:flex lg:flex-col w-64 min-h-screen bg-black p-4 z-30 `}
    >
      <div className="flex items-center justify-between mb-8 border-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#F8EF6D] mr-3"></div>
          <div>
            <h2 className="text-lg font-semibold dark:text-white">
              Louis carter
            </h2>
            <button className="text-sm text-gray-600 dark:text-gray-300">
              Edit
            </button>
          </div>
        </div>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`p-2 mb-2 rounded-md text-left w-full ${
            activeTab === tab
              ? "bg-white dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
      <div className="mt-auto flex items-center">
        <span className="mr-2 dark:text-white">Light</span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-6 rounded-full p-1 ${
            darkMode ? "bg-gray-700" : "bg-[#F8EF6D]"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transform duration-300 ease-in-out ${
              darkMode ? "translate-x-6" : ""
            }`}
          ></div>
        </button>
        <span className="ml-2 dark:text-white">Dark</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        darkMode ? "dark" : ""
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 bg-gray-50 dark:bg-black overflow-x-hidden">
        <div className="p-4 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold dark:text-white">
                Statistics
              </h1>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="hidden md:block mr-4 p-2 rounded-md bg-white dark:bg-gray-800 dark:text-white"
              />
              <button className="bg-[#F8EF6D] text-black px-4 py-2 rounded-md mr-4 text-sm lg:text-base">
                Upgrade
              </button>
              <Bell className="text-gray-600 dark:text-gray-300" />
            </div>
          </div>
          <div className="grid text-black grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6  border-white">
            <div className="bg-[#F8EF6D] p-4 lg:p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-4">
                Website traffic
              </h3>
              <div className="flex justify-center items-center">
                <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#444"
                      strokeWidth="3"
                      strokeDasharray="78, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#000"
                      strokeWidth="3"
                      strokeDasharray="22, 100"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl lg:text-2xl font-bold">
                    12k
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Social Media</span>
                  <span>78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Organic Search</span>
                  <span>22%</span>
                </div>
              </div>
            </div>
            <div className="bg-[#2B2D32] p-4 lg:p-8 rounded-lg text-white   flex flex-col justify-between">
              <div className="flex  justify-between items-start h-fit">
                <h3 className="text-sm hover:bg-[#F8EF6D] hover:text-black hover:border-none mb-4 border-2 border-[#35363B] w-fit px-5 py-1 hover:cursor-pointer rounded-full">
                  Full Report
                </h3>
                <p className="text-sm text-[#F8EF6D] font-bold mb-4">2024</p>
              </div>
              <div className="button border-2 border-[#A59F9F] py-5 px-4 rounded-3xl flex justify-between ">
                <p>Download Report</p>
                <div className="border-2 h-full">

                </div>
                <Image src={downloadicon} alt="" />
                
              </div>
            </div>
            <div className="bg-[#D6D6D6] dark:bg-[#D6D6D6] p-4 lg:p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-black">
                Bunce Rate
              </h3>
              <div className="flex justify-between mb-4  max-w-[80%] m-auto">
                <div className="py-8 px-2 border-2  border-black rounded-md flex items-center justify-center">
                  <span className="text-sm lg:text-lg font-semibold text-black ">
                    Mon 2
                  </span>
                </div>
                <div className="py-8 px-2  rounded-md flex items-center justify-center bg-[#F8EF6D]">
                  <span className="text-sm lg:text-lg font-semibold text-black ">
                    Mon 2
                  </span>
                </div>
                <div className="py-8 px-2 border-2  border-black rounded-md flex items-center justify-center">
                  <span className="text-sm lg:text-lg font-semibold text-black ">
                    Mon 2
                  </span>
                </div>
                
                
              </div>
              <div className="text-3xl lg:text-4xl font-bold mb-2 text-black">
                23%
              </div>
             
            </div>
            <div className="bg-gray-800 p-4 lg:p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-4">ROL</h3>
              <div className="text-3xl lg:text-4xl font-bold mb-2">283%</div>
              <p className="text-gray-400 text-sm lg:text-base">
                Return On Investment
              </p>
              <div className="mt-4 h-12 lg:h-16 flex items-end">
                <div className="w-1/5 h-1/4 bg-[#F8EF6D] rounded-full"></div>
                <div className="w-1/5 h-1/2 bg-[#F8EF6D] rounded-full mx-1"></div>
                <div className="w-1/5 h-1/3 bg-[#F8EF6D] rounded-full"></div>
                <div className="w-1/5 h-2/3 bg-[#F8EF6D] rounded-full mx-1"></div>
                <div className="w-1/5 h-full bg-[#F8EF6D] rounded-full"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg flex items-center justify-center">
              <button className="bg-[#F8EF6D] text-black px-4 lg:px-6 py-2 lg:py-3 rounded-md font-semibold text-sm lg:text-base">
                Web Score with AI
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Customer Churn Rate
              </h3>
              <div className="h-24 lg:h-32 flex items-end">
                <div className="w-1/6 h-1/6 bg-gray-200 dark:bg-gray-700 rounded-t-md"></div>
                <div className="w-1/6 h-1/3 bg-gray-200 dark:bg-gray-700 rounded-t-md mx-1"></div>
                <div className="w-1/6 h-full bg-[#F8EF6D] rounded-t-md"></div>
                <div className="w-1/6 h-1/2 bg-gray-200 dark:bg-gray-700 rounded-t-md mx-1"></div>
                <div className="w-1/6 h-1/4 bg-gray-200 dark:bg-gray-700 rounded-t-md"></div>
                <div className="w-1/6 h-5/12 bg-gray-200 dark:bg-gray-700 rounded-t-md ml-1"></div>
              </div>
              <div className="text-center mt-2 dark:text-white">12.8%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
