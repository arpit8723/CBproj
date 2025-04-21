// import React, { useState } from "react";
// import { sidebarConfig } from "../Config/sidebarConfig";
// import { Link } from "react-router-dom";

// // Import local images
// import umImg from "../assets/usm.png";
// import costImg from "../assets/cost.png";
// import onboardingImg from "../assets/ob.png";
// import awsInfoImg from "../assets/aws.png";

// const Sidebar = () => {
//   const [role] = useState(localStorage.getItem("role"));
//   const items = sidebarConfig[role] || [];

//   if (!role) return null;

//   // Map specific item names to images
//   const imageMap = {
//     "User Management": umImg,
//     "Cost Explorer": costImg,
//     "Onboarding": onboardingImg,
//     "AWS Services Info": awsInfoImg,
//   };

//   return (
//     <div className="w-70 h-screen bg-white text-black p-3">
//       <div className="relative top-30">
//         <ul>
//           {items.map((item, index) => (
//             <li key={index} className="mb-5">
//               <Link
//                 to={item.path}
//                 className="flex items-center gap-6 px-7 py-2 hover:text-blue-600 w-full "
//               >
//                 {imageMap[item.name] && (
//                   <img src={imageMap[item.name]} alt="icon" className="w-6 h-6" />
//                 )}
//                 <span className="text-base">{item.name}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/authSlice';
import { sidebarConfig } from '../Config/sidebarConfig';

// Import your images
import umImg from '../assets/usm.png';
import costImg from '../assets/cost.png';
import onboardingImg from '../assets/ob.png';
import awsInfoImg from '../assets/aws.png';

const Sidebar = () => {
  const { role } = useSelector(selectAuth);
  const items = role ? sidebarConfig[role] || [] : [];
  
  const imageMap = {
    "User Management": umImg,
    "Cost Explorer": costImg,
    "Onboarding": onboardingImg,
    "AWS Services Info": awsInfoImg,
  };

  return (
   <div className="w-70 h-screen bg-white text-black p-3">
  <div className="p-4  relative top-30">
    <ul>
      {items.map((item, index) => (
        
        <li key={index} className="mb-2">
          <Link
            to={item.path}
            className="flex items-center gap-4 px-5 py-2 rounded-lg hover:bg-blue-400 transition-all duration-200"
          >
            {imageMap[item.name] && (
              <img src={imageMap[item.name]} alt="icon" className="w-5 h-5" />
            )}
            <span className="text-base text-blue-900">{item.name}</span>
          </Link>
        </li>
        
      ))}
    </ul>
  </div>
</div>

  );
};

export default Sidebar;