// // src/components/Login/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css'; 
// import logo from '/src/assets/logo1.png';

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [error, setError] = useState('');
//   const [token, setToken] = useState(null);
 

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         throw new Error('Invalid Email or Password');
//       }

//       const data = await response.json();
//       console.log('Token:', data.token);
//       setToken(data.token);

//       localStorage.setItem('token', data.token);

//       const base64Payload = data.token.split('.')[1];
//       const decodedPayload = JSON.parse(atob(base64Payload));
//       const userRole = decodedPayload.role;
//       const userName=decodedPayload.username;
//       localStorage.setItem('role', userRole);
//       localStorage.setItem('username',userName);

//       alert('login successful');
//       navigate('/costexplorer');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="login-logo">
//           <img
//             src={logo}
//             alt="CloudKeeper"
//           />
//         </div>

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="login-form-group">
//             <label className="login-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="login-input"
//             />
//           </div>

//           <div className="login-form-group">
//             <label className="login-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="login-input"
//             />
//           </div>

//           <div className="login-forgot">
//             <a href="#">Forgot Password?</a>
//           </div>

//           <button type="submit" className="login-button">
//             LOGIN
//           </button>

//           {error && <p className="login-error">{error}</p>}
//         </form>

//       </div>
//     </div>
//   );
// };

// export default Login;
 // src/components/Login/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuth } from '../redux/slices/authSlice';
import './Login.css';
import logo from '/src/assets/logo1.png';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(selectAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    
    if (loginUser.fulfilled.match(result)) {
      navigate('/costexplorer');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logo} alt="CloudKeeper" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;