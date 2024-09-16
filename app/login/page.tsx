"use client";
import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import emailIcon from '../../public/email.svg';
import lock from '../../public/lock.svg';
import Link from "next/link";
import loader from '@/public/Spinner@1x-1.0s-200px-200px.svg'



// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

const LoginSignup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setloading] = useState(false)
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { email, password } = formData;

    // Check if the user is the admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Redirect to admin panel
      router.push("/admin");
    } else {
      // Call the sign-in method for non-admin users
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // Handle sign-in error
        setError(result.error);
      } else {
        // If sign-in is successful, check if the user exists in the database
        const userExists = await checkIfUserExists(email, password);

        if (userExists) {
          // Redirect to the user dashboard
          router.push("/");
        } else {
          // Show an error message if the user does not exist
          setError("No user available. Please sign up.");
        }
      }
    }
  };

  // Function to check if a user exists in the database
  const checkIfUserExists = async (email: string, password: string) => {
    try {
      setloading(true)
      const response = await fetch('/api/users/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password to the API
      });

      if (!response.ok) {
        throw new Error('Failed to check if user exists');
      }

      const data = await response.json();
      return data.exists; // Return true if the user exists, otherwise false
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }finally{
      setloading(false)
    }
  };


  return (
    <>
    {loading ? (
      <div className="h-screen w-screen flex items-center justify-center bg-white">

      <Image src={loader} alt="" className="w-52" /> 
      </div>
) : (
  <div className="flex justify-center items-center min-h-screen bg-white shadow-xl">
      <div className="w-full max-w-sm bg-[#d6d6d6] rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-black mb-4">
          Sign in with email
        </h2>
        <p className="text-sm text-center text-black mb-6">
          Make a new doc to bring your word, data, and teams together. For free
        </p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2 relative">
            <Image src={emailIcon} alt="Email" className="absolute top-1/2 w-4 left-4 transform -translate-y-1/2 -translate-x-1/2" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 pl-8 py-1 bg-white text-[#2B2D32] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2 relative">
            <Image src={lock} alt="Password" className="absolute top-1/2 w-4 left-4 transform -translate-y-1/2 -translate-x-1/2" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 pl-8 py-1 bg-white text-[#2B2D32] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
          </div>
          <button type="submit" className="w-full bg-[#F8EF6D] text-black font-bold py-2 rounded-md hover:bg-yellow-400 transition duration-300">
            Sign in
          </button>
        </form>
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-600 w-full"></div>
         <p className="text-sm text-black mx-4">Don&apos;t&nbsp;have&nbsp;an&nbsp;account?</p>
          <div className="h-px bg-gray-600 w-full"></div>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="text-sm text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
)}
    
              </>
  );
};

export default LoginSignup;


// "use client";
// import React, { useState, FormEvent } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import emailIcon from '../../public/email.svg';
// import lock from '../../public/lock.svg';
// import Link from "next/link";

// const LoginSignup = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // Hardcoded admin credentials
//   const ADMIN_EMAIL = "admin@gmail.com";
//   const ADMIN_PASSWORD = "123456";

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
    
//     const { email, password } = formData;

//     // Check if the user is the admin
//     if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//       // Redirect to admin panel
//       router.push("/admin");
//     } else {
//       // Check if the user exists (call the API)
//       const userExists = await checkIfUserExists(email, password);
//       if (userExists) {
//         // Redirect to user dashboard
//         router.push("/");
//       } else {
//         // Show error if the user does not exist
//         setError("No user available. Please sign up.");
//       }
//     }
//   };

//   // Function to check if a user exists in the database
//   const checkIfUserExists = async (email: string, password: string) => {
//     try {
//       const response = await fetch('/api/users/checkUser', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }), // Send email and password to the API
//       });
//       const data = await response.json();
//       return data.exists; // Return true if the user exists, otherwise false
//     } catch (error) {
//       console.error("Error checking user:", error);
//       return false;
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#232527] shadow-xl shadow-black">
//       <div className="w-full max-w-sm bg-[#2B2D32] rounded-lg p-6 shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-white mb-4">
//           Sign in with email
//         </h2>
//         <p className="text-sm text-center text-gray-400 mb-6">
//           Make a new doc to bring your word, data, and teams together. For free
//         </p>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-2 relative">
//             <Image src={emailIcon} alt="Email" className="absolute top-1/2 w-4 left-4 transform -translate-y-1/2 -translate-x-1/2" />
//             <input
//               type="email"
//               id="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-6 pl-8 py-1 bg-white text-[#2B2D32] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="mb-2 relative">
//             <Image src={lock} alt="Password" className="absolute top-1/2 w-4 left-4 transform -translate-y-1/2 -translate-x-1/2" />
//             <input
//               type="password"
//               id="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-6 pl-8 py-1 bg-white text-[#2B2D32] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button type="submit" className="w-full bg-[#F8EF6D] text-black font-bold py-2 rounded-md hover:bg-yellow-400 transition duration-300">
//             Sign in
//           </button>
//         </form>
//         <div className="flex items-center justify-center my-4">
//           <div className="h-px bg-gray-600 w-full"></div>
//          <p className="text-sm text-gray-400 mx-4">Don&apos;t&nbsp;have&nbsp;an&nbsp;account?</p>
//           <div className="h-px bg-gray-600 w-full"></div>
//         </div>
//         <div className="flex justify-center gap-4">
//           <Link href="/signup" className="text-sm text-blue-400 hover:underline">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginSignup;
