import React, { useContext, useState, useEffect, useRef } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { userDataContext } from '../context/UserContext';


function AdminDashBord() {
  const { userData, handleLogOut } = useContext(userDataContext);
   const [popUp, setPopUp] = useState(false);
   const popUpRef = useRef(null);
   const buttonRef = useRef(null);
 
   // Close popup if click is outside of button and popup
   useEffect(() => {
     const handleClickOutside = (event) => {
       if (
         popUpRef.current &&
         !popUpRef.current.contains(event.target) &&
         buttonRef.current &&
         !buttonRef.current.contains(event.target)
       ) {
         setPopUp(false);
       }
     };
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);
 
   const handleButtonClick = () => {
     setPopUp(prev => !prev);  
   };
 
   return (
     <div className='fixed top-0 w-full bg-white shadow-md z-50'>
       <div className='flex items-center justify-between w-full min-h-[80px] px-4 sm:px-6 md:px-10 lg:px-20 border-b border-gray-300'>
 
         {/* Logo */}
         <div className='flex items-center gap-3'>
           <div className='text-2xl sm:text-3xl font-bold text-red-500 whitespace-nowrap'>
             Admin Pannel
           </div>
         </div>
 
         {/* Profile / Menu */}
         <div className='flex items-center gap-4 relative'>
           <button 
             ref={buttonRef} 
             onClick={handleButtonClick} 
             className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-lg transition-shadow duration-300 bg-white'
           >
             <GiHamburgerMenu className='w-6 h-6 text-gray-700' />
             {userData == null && <CgProfile className='w-7 h-7 text-gray-700' />}
             {userData != null && (
               <span className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg sm:text-xl uppercase">
                 {userData?.name?.slice(0, 1)}
               </span>
             )}
           </button>
 
           {/* Popup Menu */}
           {popUp && (
             <div 
               ref={popUpRef} 
               className='absolute right-0 top-[60px] w-52 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slideDown z-50'
             >
               <ul className='flex flex-col items-start justify-start text-gray-700 text-base sm:text-lg'>
                 {userData == null && 
                   <li className='w-full px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 rounded-md'>
                     Login
                   </li>
                 }
                 {userData != null && 
                   <li 
                     onClick={handleLogOut} 
                     className='w-full px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer transition-colors duration-200 rounded-md'
                   >
                     Logout
                   </li>
                 }
               </ul>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }

export default AdminDashBord