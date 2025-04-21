import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUserThunk, selectUsers } from '../redux/slices/userSlice';
import { selectAuth } from '../redux/slices/authSlice';
import { MdModeEdit } from "react-icons/md";             

import {
  IconButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { MdOutlineCalendarToday, MdOutlineAccessTime } from "react-icons/md";

const UserManage = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(selectAuth);
  const { users, isLoading, error } = useSelector(selectUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  
 
  
  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleFilterSelect = (value) => {
    setRoleFilter(value);
    setFilterOpen(false);
  };

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (token) dispatch(fetchUsers());
  }, [dispatch, token]);

  // Filter users based on role filter
  const filteredUsers = roleFilter 
    ? users.filter(user => user.role === roleFilter)
    : users;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/accounts/get', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setAccounts(data);
      } catch (err) {
        console.error('Error fetching accounts:', err.message);
      }
    };

    if (role === 'CUSTOMER') {
      fetchAccounts();
    } else {
      setAccounts([]);
    }
  }, [role, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      role,
      accountIds: selectedAccounts
    };
  
    try {
      if (editingUser) {
        await dispatch(updateUserThunk({
          userId: editingUser.id,
          data: payload,
          token: token
        })).unwrap();
        
        alert('User updated successfully!');
      } else {
        await dispatch(createUser(payload)).unwrap();
        alert('User created successfully!');
      }
  
      setForm({ username: '', email: '', password: '' });
      setRole('');
      setSelectedAccounts([]);
      setEditingUser(null);
      setShowForm(false);
      dispatch(fetchUsers());
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, email: user.email, password: '' });
    setRole(user.role);
    setSelectedAccounts(user.accounts?.map(a => a.id) || []);
    setShowForm(true);
  };

  const [tempSelected, setTempSelected] = useState([]);
  const [tempDeselected, setTempDeselected] = useState([]);

  const handleTempToggle = (id, type) => {
    if (type === 'add') {
      setTempSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setTempDeselected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handleMoveToSelected = () => {
    setSelectedAccounts((prev) => [...prev, ...tempSelected]);
    setTempSelected([]);
  };

  const handleMoveToAvailable = () => {
    setSelectedAccounts((prev) => prev.filter((id) => !tempDeselected.includes(id)));
    setTempDeselected([]);
  };

  const resetFormState = () => {
    setForm({ username: '', email: '', password: '' });
    setRole('');
    setSelectedAccounts([]);
    setTempSelected([]);
    setTempDeselected([]);
    setEditingUser(null);
    setShowForm(false);
  };
  
  useEffect(() => {
    if (role !== 'CUSTOMER') {
      setSelectedAccounts([]);
      setTempSelected([]);
      setTempDeselected([]);
    }
  }, [role]);

  return (
    <div className="p-4 max-w-full mx-auto ">
      {!showForm ? (
        <>
          <div className="flex flex-col items-start gap-3 mb-5">
            <h1 className="text-2xl font-bold">All Users</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              ✚ Add User
            </button>
          </div>

          {isLoading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="max-w-full mx-auto px-4 relative right-4">
              <div className="rounded-lg shadow border border-gray-200">
                <div className="overflow-x-auto">
                  <div className="w-full">
                    {/* Header Table */}
                    <table className="w-full table-fixed">
                      <thead className="bg-blue-100 text-blue-800 font-semibold">
                        <tr>
                          <th className="px-4 py-2 text-left w-1/4">Username</th>
                          <th className="px-4 py-2 text-left w-1/4">Email</th>
                          
                          <th className="px-4 py-2 text-left w-1/4 relative">
                            <div className="flex items-center gap-1">
                              Role
                              <div className="relative inline-block text-left">
                                <button
                                  onClick={handleFilterClick}
                                  className="inline-flex items-center justify-center text-blue-800 hover:text-blue-600 focus:outline-none transition-colors"
                                >
                                  <FiFilter className="w-4 h-4" />
                                  <FiChevronDown 
                                    className={`ml-1 w-3 h-3 transition-transform ${filterOpen ? 'rotate-180' : ''}`}
                                  />
                                </button>
                                
                                {/* Dropdown menu */}
                                <div 
                                  className={`absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 z-10 ${
                                    filterOpen
                                      ? 'transform opacity-100 scale-100'
                                      : 'transform opacity-0 scale-95 pointer-events-none'
                                  }`}
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleFilterSelect("")}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        roleFilter === "" 
                                          ? 'bg-blue-100 text-blue-900' 
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      All Roles
                                    </button>
                                    <button
                                      onClick={() => handleFilterSelect("ADMIN")}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        roleFilter === "ADMIN" 
                                          ? 'bg-blue-100 text-blue-900' 
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      ADMIN
                                    </button>
                                    <button
                                      onClick={() => handleFilterSelect("CUSTOMER")}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        roleFilter === "CUSTOMER" 
                                          ? 'bg-blue-100 text-blue-900' 
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      CUSTOMER
                                    </button>
                                    <button
                                      onClick={() => handleFilterSelect("READONLY")}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        roleFilter === "READONLY" 
                                          ? 'bg-blue-100 text-blue-900' 
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      READONLY
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th className="px-6 py-2 text-left w-1/4">
  <div className="flex items-center">
    Last Login
  </div>
</th>

                          <th className="px-7 py-2 text-left w-1/4">Action</th>
                        </tr>
                      </thead>
                    </table>

                    {/* Scrollable Body - Set minimum height to prevent collapse */}
                    <div className="min-h-[600px] max-h-[600px] overflow-y-auto">
                      <table className="w-full table-fixed">
                        <tbody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((u, index) => (
                              <tr
                                key={u.id}
                                className={`${
                                  index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                                } hover:bg-blue-50 transition-colors`}
                              >
                                <td className="px-5 py-2 w-1/4">{u.username}</td>
                                <td className="px-2 py-2 w-1/4">{u.email}</td>
                                <td className="px-0 py-2 w-1/4">{u.role}</td>
                                <td className="px-0 py-2 text-left w-1/4"> 
                                <div className="flex items-center">
  {u.lastLogin ? (
    <div className="flex items-center">
      <MdOutlineCalendarToday className="mr-1 text-gray-500" />
      <span>{new Date(u.lastLogin).toLocaleDateString()}</span>
      <MdOutlineAccessTime className="ml-2 mr-1 text-gray-500" />
      <span>
        {new Date(u.lastLogin).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
  ) : '—'}
  </div>
</td>


                                <td className="px-2 py-2 w-1/5">
                                  <button
                                    className="text-blue-600 hover:underline text-sm"
                                    onClick={() => handleEdit(u)}
                                  >
                                    <MdModeEdit />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                No users found with the selected filter.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">{editingUser ? 'Update User' : 'Add New User'}</h1>
              <button
                onClick={resetFormState}
                className="text-sm text-red-600 hover:underline"
              >
                Cancel
              </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="">Select Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="READONLY">READONLY</option>
            </select>

            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-4"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>

          {role === 'CUSTOMER' && accounts.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-4">Assign Accounts</h2>
              <div className="flex gap-4">
                {/* LEFT LIST (Available) */}
                <div className="w-1/2 border rounded p-3 shadow bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Choose Account IDs to Associate</span>
                    <span className="text-sm text-blue-600">{accounts.length} Available</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {accounts
                      .filter((acc) => !selectedAccounts.includes(acc.id))
                      .map((acc) => (
                        <label key={acc.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={tempSelected.includes(acc.id)}
                            onChange={() => handleTempToggle(acc.id, 'add')}
                          />
                          <span>{acc.accountName} ({acc.accountNumber})</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* ARROW BUTTONS */}
                <div className="flex flex-col justify-center gap-4">
                  <IconButton
                    color="primary"
                    onClick={handleMoveToSelected}
                    disabled={tempSelected.length === 0}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={handleMoveToAvailable}
                    disabled={tempDeselected.length === 0}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </div>

                {/* RIGHT LIST (Selected) */}
                <div className="w-1/2 border rounded p-3 shadow bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Associated Account IDs</span>
                    <span className="text-sm text-blue-600">{selectedAccounts.length} Added</span>
                  </div>
                  {selectedAccounts.length === 0 ? (
                    <div className="flex flex-col items-center text-gray-500 py-10">
                      <FolderOffOutlinedIcon fontSize="large" />
                      <p className="mt-2 text-sm">No Account IDs Added</p>
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto space-y-1">
                      {selectedAccounts.map((id) => {
                        const acc = accounts.find((a) => a.id === id);
                        return (
                          <label key={id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={tempDeselected.includes(id)}
                              onChange={() => handleTempToggle(id, 'remove')}
                            />
                            <span>{acc?.accountName} ({acc?.accountNumber})</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManage;