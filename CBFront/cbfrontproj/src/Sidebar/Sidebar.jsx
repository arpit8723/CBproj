import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/authSlice';
import { sidebarConfig } from '../Config/sidebarConfig';

// MUI + React Icons
import PeopleIcon from '@mui/icons-material/People';
import { FaCoins, FaHandshake } from 'react-icons/fa';
import { FaAws } from 'react-icons/fa'; // ✅ FontAwesome AWS logo


const iconMap = {
  'User Management': PeopleIcon,
  'Cost Explorer': FaCoins,
  'Onboarding': FaHandshake,
  'AWS Services Info': FaAws,
};

const Sidebar = () => {
  const { role } = useSelector(selectAuth);
  const items = role ? sidebarConfig[role] || [] : [];
  const location = useLocation();

  return (
    <div className="w-70 h-screen bg-white text-black p-3">
      <div className="p-4 relative top-25">
        <ul>
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            const IconComponent = iconMap[item.name];

            return (
              <li key={index} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-900'
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      isActive ? 'bg-blue-800' : 'bg-gray-100'
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={18}
                        style={{ color: isActive ? 'white' : 'black' }}
                      />
                    )}
                  </div>
                  <span className="text-base">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
