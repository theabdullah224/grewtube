"use client";
import React, { useState } from "react";
import { Sun, Moon, Bell, Menu } from "lucide-react";
import Image from "next/image";
import downloadicon from "../public/downloadicon.svg";
import dashboard from "../public/dashboard.svg";
import acitvity from "../public/activity.svg";
import schedule from "../public/scheduale.svg";
import setting from "../public/setting.svg";
import Link from "next/link";
import { Trash2 } from 'lucide-react';
import { any } from "@tensorflow/tfjs";
import ChartComponent from './components/ChartComponent'
import Spinner from '../public/Spinner@1x-1.0s-200px-200px.svg';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";






interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  isOpen,
  setIsOpen,
}) => {
  const tabs = [
    { title: "Dashboard", image: "/dashboard.svg" },
    { title: "Activity", image: "/activity.svg" },
    { title: "Schedule", image: "/scheduale.svg" },
    { title: "Setting", image: "/setting.svg" }
  ];
  const [username, setusername] = useState("")
  

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0  transition duration-200 ease-in-out lg:flex lg:flex-col w-64 min-h-screen bg-black p-4 z-30 `}
    >
      <div className="logo mb-20">
        <h1>LOGO</h1>
      </div>
      {/* <div className=" mb-8 ">
        <div className="flex items-center  flex-col  justify-center">
          <div className="w-20 h-20 rounded-full bg-[#F8EF6D] mr-3"></div>
            <h2 className="text-lg font-bold dark:text-white">{username}</h2>
          
        </div>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div> */}  
      {tabs.map((tab) => (
        <button
          key={tab.title}
          className={`p-2 mb-4 rounded-md text-left w-full  ${
            activeTab === tab.title
              ? "bg-white dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => setActiveTab(tab.title)}
        >
          <div className="flex gap-2">

          <Image src={tab.image} alt="" width={16} height={16}/>
          {tab.title}
          </div>
          
        </button>
      ))}
     
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, settitle] = useState("")
  const [view, setview] = useState("")
  const [like, setlike] = useState("")
  const [sentiment, setsentiment] = useState("")
  const [positivecomments, setpositivecomments] = useState("")
  const [negativecomments, setnegative] = useState("")
  const [loading, setLoading] = useState(false);




// ------------------Activity tab------------------------------------------

  const [inputUrl, setInputUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession(); 
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedUrls = async () => {
      if (!session || !session.user) return;
  
      try {
        const response = await fetch('/api/users/saveUrl', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        
        if (response.ok) {
          console.log('Fetched URLs:', data.urls); // Log the fetched URLs
          setHistory(data.urls); // Update history with fetched URLs
        } else {
          console.error('Error fetching URLs:', data.error); // Log the error returned from the API
          setError(data.error || 'Failed to fetch saved URLs.');
        }
      } catch (error) {
        console.error('Fetch error:', error); // Log fetch-related errors
        setError('An error occurred while fetching URLs.');
      }
    };
  
    fetchSavedUrls();
  }, [session]);
  
  const handleAddUrl = async () => {
    if (!session || !session.user) {
      setError('User not authenticated. Please log in.');
      setIsLoading(false);
      return;
    }
  
    const userId = session.user.id;
  
    // YouTube URL Validation
    const isValidYoutubeUrl = (url: string) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      return youtubeRegex.test(url);
    };
  
    if (!isValidYoutubeUrl(inputUrl)) {
      setError('Invalid YouTube URL. Please provide a valid YouTube video URL.');
      return; // Do not proceed if URL is invalid
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      // Check if the URL already exists in the user's saved URLs
      const checkUrlResponse = await fetch(`/api/users/saveUrl`, {
        method: 'GET',
      });
  
      if (!checkUrlResponse.ok) {
        const errorData = await checkUrlResponse.json();
        setError(errorData.error || 'Error fetching saved URLs');
        return;
      }
  
      const savedUrls = await checkUrlResponse.json();
  
      // Check if the input URL already exists in the user's saved URLs
      const isDuplicate = savedUrls.urls.some((urlObj: { url: string }) => urlObj.url === inputUrl);
  
      if (!isDuplicate) {
        // If not a duplicate, save the URL in the database
        const saveResponse = await fetch('/api/users/saveUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: inputUrl, userId }), // Pass userId and videoUrl
        });
  
        if (!saveResponse.ok) {
          const saveErrorData = await saveResponse.json();
          setError(saveErrorData.error || 'Failed to save the URL to the database');
          return;
        }
      } else {
        // Show a warning, but allow the video to be analyzed again
        setError('This URL has already been saved, but it will be analyzed again.');
      }
  
      // Proceed with analyzing the URL regardless of whether it's a duplicate
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: inputUrl }),
      });
  
      if (analyzeResponse.ok) {
        const data = await analyzeResponse.json();
        console.log("------------------>>>>",data)
        settitle(data.title)
        setview(data.views)
        setsentiment(data.sentiment)
        setlike(data.likes)
        setVideoData(data);
        setpositivecomments(data.positiveCommentCount)
        setnegative(data.negativeCommentCount)
        if (!isDuplicate) {
          setHistory([{ url: inputUrl, data }, ...history]); // Add to history if not a duplicate
        }
        setInputUrl('');
        setActiveTab("Dashboard");
      } else {
        const errorData = await analyzeResponse.json();
        setError(errorData.error || 'Failed to analyze the video');
      }
    } catch (error) {
      setError('Error processing the request');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleDeleteUrl = async (urlId) => {
    try {
      const response = await fetch('/api/users/deleteUrl', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urlId }), // Send the _id of the URL
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('URL deleted successfully:', data);
        // Update local history by removing the deleted URL from the UI
        setHistory(history.filter(item => item._id !== urlId));
      } else {
        console.error('Error deleting URL:', data.error);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };
  
// ----------------Setting Tab----------------------------------------
const [userData, setUserData] = useState({ username: "", email: "" });
const router = useRouter();
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [successMessage, setSuccessMessage] = useState('');

const changePassword = async () => {
  const oldPassword = 'oldPassword123';
  const newPassword = 'newPassword456';
  const userId = 'user-id-here'; // Obtain this from session or user context

  try {
    const response = await fetch('/api/users/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Password changed successfully:', data.message);
    } else {
      console.error('Error changing password:', data.error);
    }
  } catch (error) {
    console.error('Error making request:', error);
  }
};


useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me"); // Assuming you have an API route to fetch user details
      const data = await response.json();
      setUserData({ username: data.username, email: data.email });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  if (session) {
    fetchUserData();
  }
}, [session]);
const handleLogout = async () => {

  await signOut({
    redirect: false,
  });


  router.push("/login");
};

// Handle Delete Account

const handleDeleteAccount = async () => {
  const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");

  if (!confirmed) return;

  try {
    const response = await fetch("/api/users/deleteAccount", {
      method: "DELETE",
    });

    if (response.ok) {
      // Redirect to login after successful account deletion
      router.push("/signup");
    } else {
      const data = await response.json();
      setError(data.error || "Failed to delete account.");
    }
  } catch (error) {
    setError("An error occurred while deleting the account.");
  }
};

// ----------------------------------------------------------------------


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
                {activeTab}
              </h1>
            </div>
            <div className="flex items-center">
             

                <Link href="/upgrade">
              <button className="bg-[#F8EF6D]  px-4 py-2 rounded-md mr-4 text-sm lg:text-base">
                <span className="text-black">

                Upgrade
                </span>
              </button>



                </Link>
                {session ? (
        <button
          className="border-2 border-[#F8EF6D] text-[#F8EF6D]  px-4 py-2 rounded-md mr-4 text-sm lg:text-base"
          onClick={() => signOut({ callbackUrl: "/login" })} // Sign out and redirect to login page
        >
          <span className="text-[#F8EF6D]">Logout</span>
        </button>
      ) : (
        // If no session, show the "Login" button
        <Link href="/login">
          <button className="bg-[#F8EF6D] px-4 py-2 rounded-md mr-4 text-sm lg:text-base">
            <span className="text-black">Login</span>
          </button>
        </Link>
      )}
              
            </div>
          </div>

{/* ----------------Dashboard---------------------------Conditionally render the content based on the active tab-------------------------- */}
        
          {activeTab === "Dashboard" && (
            <div className="text-black">
              <h2>Dashboard Content</h2>
              <div className="flex-1 bg-gray-50 dark:bg-black overflow-x-hidden">
                <div className="p-4 lg:p-8 ">
                  <div className="grid text-black grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 min-h-[80vh] ">
                    <div className="bg-[#F8EF6D] p-4 lg:p-6 rounded-lg flex items-center justify-center flex-col">
                        <span className="font-bold text-5xl">Title</span>
                      <h3 className=" font-bold text-black mb-4 text-3xl">
                        {title}
                      </h3>
                     
                      
                      
                    </div>
                    <div className="bg-[#2B2D32] p-4 lg:p-8 rounded-lg text-white   flex flex-col items-center justify-center">
                    <span className="font-bold text-5xl">Views</span>
                      <h3 className=" font-bold  mb-4 text-3xl text-white break-words text-wrap">
                        {view}
                      </h3>
                    </div>



                    <div className="bg-[#D6D6D6] p-4 lg:p-6 rounded-lg">
                      <h3 className="text-lg font-bold mb-4 text-black">
                        Comments
                      </h3>
                      <div className="flex justify-between  mb-4  max-w-[50%] m-auto">
                      <div className="py-8 px-2  rounded-md flex items-center justify-center bg-[#F8EF6D] w-[4.5rem]">
                          <span className="text-sm lg:text-lg font-bold text-black ">
                            
                            {positivecomments}
                          </span>
                        </div>
                        <div className="py-8 px-2 border-2  border-black rounded-md flex items-center justify-center w-[4.5rem]">
                          <span className="text-sm lg:text-lg font-bold text-black ">
                          {negativecomments}
                          </span>
                        </div>
                        
                       
                      </div>
                      <div className=" mb-2 text-black">
                          <div className="flex items-center   gap-2">
                            <div className="h-4 w-4 bg-[#F8EF6D]"></div>
                            <p>Positive</p>
                          </div>
                          <div className="flex items-center   gap-2">
                            <div className="h-4 w-4 border-2 border-black"></div>
                            <p>Negative</p>
                          </div>
                      </div>
                    </div>



                    <div className="bg-gray-800 p-4 lg:p-6 rounded-lg text-white flex flex-col items-center justify-center">
                    <span className="font-bold text-5xl">Likes</span>
                      <h3 className="font-bold  mb-4 text-3xl text-white break-words text-wrap">
                        {like}
                      </h3>                 
                    </div>
                    <div className=" bg-[#D6D6D6] p-4 lg:p-6 rounded-lg flex flex-col items-center justify-center">
                    <span className="font-bold text-5xl">Sentiment</span>
                      <h3 className="font-bold  mb-4 text-3xl text-black break-words text-wrap">
                        {sentiment}
                      </h3>
                    </div>





                    <div className="bg-[rgb(43,45,50)] p-4 lg:p-6 rounded-lg">
      <h2 className="text-center text-white text-lg mb-4">Comment Sentiment Analysis</h2>
      <ChartComponent  positivechart={positivecomments} negativechart={negativecomments} />
    </div>




                  </div>
                </div>
              </div>
            </div>
          )}


{/* ---------------------------------------------Activity Tab--------------------------------------------------------- */}

{activeTab === "Activity" && (
<div className="text-black">
      <h2>Activity Section</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full ">
          <Image src={Spinner} alt="Loading..." className="w-52" />
        </div>
      ) : (
        <div className="border-gray-300 rounded-lg p-4 h-full">
          <div className="flex space-x-4 mb-4">
            <input
              className="bg-transparent border-2 border-gray-400 rounded-lg placeholder-gray-400 text-white py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="url"
              placeholder="Enter YouTube URL..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <button
              className="bg-[#F8EF6D] text-black font-bold py-2 px-6 rounded-lg hover:bg-[#F8EF6D] transition duration-300"
              onClick={handleAddUrl}
            >
              Add
            </button>
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="history bg-gray-800 p-4 rounded-lg text-white">
            {history.map((item) => (
  <div key={item._id} className="mb-2 flex justify-between items-center">
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
      {item.url}
    </a>
    <button
      onClick={() => handleDeleteUrl(item._id)} // Pass the _id to handleDeleteUrl
      className="text-red-500 hover:text-red-700 transition duration-300"
    >
      <Trash2 size={20} />
    </button>
  </div>
))}

          </div>
        </div>
      )}
    </div>
 )} 



{/* ---------------------------------------------------------------------------------------------------------------- */}

          {activeTab === "Schedule" && (
            <div className="text-black">
              <h2>Schedule Section</h2>
              {/* Place the schedule-specific content here */}
            </div>
          )}

  {/* --------------------------Setting---------------------------------------------------------------------------- */}
        
            {activeTab === "Setting" && (
              <div className="text-black">
                <h2>Setting Section</h2>
                <div className="w-full flex flex-col items-center p-6 bg-black min-h-screen">
        {/* User Profile Section */}
        <div className="flex flex-col items-center mb-6">
          {/* Yellow circle instead of user image */}
          {/* <div className="w-20 h-20 bg-yellow-400 rounded-full"></div> */}
          <h2 className="text-2xl font-bold mt-4 text-white">
            {userData.username || "Username"} {/* Replace with fetched username */}
          </h2>
          <p className="text-gray-400">{userData.email || "user@example.com"}</p>
        </div>

        {/* Settings Options */}
        <div className="w-full max-w-sm">
          <button
            className="w-full bg-black text-white font-bold py-2 px-6 mb-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition duration-300 text-left"
            onClick={changePassword} // Change to your change password route
          >
            Change Password
          </button>

          <button
            className="w-full bg-black text-white font-bold py-2 px-6 mb-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition duration-300 text-left"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="w-full bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300 text-left"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
              </div>
            )}

  {/* --------------------------------------------------------------------------------------------------------------- */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

