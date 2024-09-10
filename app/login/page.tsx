"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import men from '../../public/men.svg'
import email from '../../public/email.svg'
import lock from '../../public/lock.svg'
import Image from "next/image";
import apple from '../../public/ic_twotone-apple.svg'
import google from '../../public/flat-color-icons_google.svg'
import fb from '../../public/logos_facebook.svg'
import Link from "next/link";

const LoginSignup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#232527] shadow-xl shadow-black">
    <div className="w-full max-w-sm bg-[#2B2D32] rounded-lg p-6 shadow-lg">
     
    
      <h2 className="text-2xl font-semibold text-center text-white mb-4">
        Sign in with email
      </h2>
      <p className="text-sm text-center text-gray-400 mb-6">
        Make a new doc to bring your word, data, and teams together. For free
      </p>
      {/* Form */}
      <form>
       
        <div className="mb-2 relative ">
          <Image src={email} alt="" className="absolute top-1/2 w-4 left-4 transform -translate-y-1/2 -translate-x-1/2" />
          <input
            type="email"
            id="name"
            placeholder="Email"
            className="w-full px-6 pl-8 py-1 bg-white text-[#2B2D32] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2 relative ">
          <Image src={lock} alt="" className="absolute top-1/2 w-4 left-4 transform -translate-y-1/2 -translate-x-1/2" />
          <input
            type="password"
            id="name"
            placeholder="Password"
            className="w-full px-6 pl-8 py-1 bg-white text-[#2B2D32] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#F8EF6D] text-black font-bold py-2 rounded-md hover:bg-yellow-400 transition duration-300"
        >
          Sign in
        </button>
      </form>
      {/* Divider */}
      <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-600 w-full"></div>
          <p className="text-sm text-gray-400 mx-4">Don&apos;t&nbsp;have&nbsp;an&nbsp;account?</p>
          <div className="h-px bg-gray-600 w-full"></div>
        </div>
        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
        <Link href="/signup" className="text-sm text-blue-400 hover:underline">
              Sign Up
            </Link>
        </div>
    </div>
  </div>
  );
};

export default LoginSignup;


