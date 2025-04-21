// import React from 'react';
// import './Navbar.css'; // We'll update this too
// import logo from '../assets/logo1.png'
// import user from '../assets/userLogo.png'
// import logout from '../assets/log.png'


// const Navbar = () => {
//   const username = localStorage.getItem('username');
//   const role = (localStorage.getItem('role') || "").toLowerCase();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('username');
//     window.location.href = '/'; // or use useNavigate
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src={logo} alt="CloudKeeper Logo" className="logo" />
//       </div>

//       <div className="navbar-right">
//       <div className="welcome">
//     <img src={user} alt="User" className="user-icon" />
    
//     <div className="user-info">
//       <div className="role">{role}</div>
//       <span>
//         Welcome, <strong>{username}</strong>
//       </span>
//     </div>
//   </div>
//         <button className="logout-button" onClick={handleLogout}>
//         <img src={logout} alt="logout icon" className="logout-icon" />
//          Logout</button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuth, logout } from '../redux/slices/authSlice';
import './Navbar.css';
import logo from '../assets/logo1.png';
import user from '../assets/userLogo.png';
import logoutIcon from '../assets/log.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, role, token } = useSelector(selectAuth); // ← include token

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // ← send token if needed
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Logout API failed:', err);
      // Optional: show a toast or fallback message
    } finally {
      dispatch(logout()); // clear Redux and localStorage
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="CloudKeeper Logo" className="logo" />
      </div>

      <div className="navbar-right">
        <div className="welcome">
          <img src={user} alt="User" className="user-icon" />
          <div className="user-info">
            <div className="role">{role?.toLowerCase()}</div>
            <span>
              Welcome, <strong>{username}</strong>
            </span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="logout icon" className="logout-icon" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
