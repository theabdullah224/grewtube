import React from 'react'
import tick from '../../public/tickicon.svg'
import Image from 'next/image'
function page() {
  return (
    <div>
       <div className="bg-[#232527] shadow-xl shadow-black min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className='font-bold text-4xl mb-4'>Plans</h1>
      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="  rounded-lg p-8 bg-[#35363B] shadow-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Free</h2>
          <p className="text-gray-400 mb-6">For freelancers</p>
          <p className="text-5xl font-bold mb-6">$0</p>
          <ul className="mb-6 space-y-4">
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> 1 user
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> 10 downloads per month
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> Roster files
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> Roster files
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> Roster files
            </li>
          </ul>
          <button className="w-full bg-[#F8EF6D] text-black py-2 rounded-lg font-bold hover:bg-yellow-500 transition duration-300">
            Subscribe
          </button>
        </div>

        {/* Pro Plan */}
        <div className=" rounded-lg p-8 bg-[#35363B] shadow-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Pro</h2>
          <p className="text-gray-400 mb-6">For agencies</p>
          <p className="text-5xl font-bold mb-6">$40</p>
          <ul className="mb-6 space-y-4">
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> 3 users
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> Unlimited downloads
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> Fully-editable files
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> Custom packs
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2"><Image src={tick} alt="" className='w-4' /></span> 200+ custom icons
            </li>
          </ul>
          <button className="w-full bg-[#F8EF6D] text-black py-2 rounded-lg font-bold hover:bg-yellow-500 transition duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default page
