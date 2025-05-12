import React, { useState, useEffect } from 'react';
import AccountSelector from './AccountSelector';
import {
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { selectAuth } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';


const UserForm = ({
  editingUser,
  handleSubmit,
  handleChange,
  form,
  role,
  setRole,
  selectedAccounts,
  setSelectedAccounts,
  resetFormState,
  token
}) => {
  const [accounts, setAccounts] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);
  const [tempDeselected, setTempDeselected] = useState([]);
  const [errors, setErrors] = useState({});
  const { username: loggedInUsername } = useSelector(selectAuth);
const isSelfEdit = editingUser && editingUser.username === loggedInUsername;

 
  const [originalAccounts, setOriginalAccounts] = useState([]);

  useEffect(() => {
   
    if (editingUser && role === 'CUSTOMER') {
      setOriginalAccounts([...selectedAccounts]);
    }
  }, [editingUser, role]);  

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
      
   
      if (editingUser && originalAccounts.length > 0) {
        setSelectedAccounts(originalAccounts);
      }
    } else {
      
      if (!editingUser) {
        setSelectedAccounts([]);
      }
    
    }
  }, [role, token, editingUser, originalAccounts]);

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
  
      if (role !== 'CUSTOMER' && editingUser) {
        setSelectedAccounts([]);
      }
      handleSubmit(e);
    }
  };


  const handleRoleChange = (newRole) => {
    setRole(newRole);

    if (role === 'CUSTOMER' && editingUser) {
      setOriginalAccounts([...selectedAccounts]);
    }
  };

  return (
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

      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-6">
        <TextField
          label="Username *"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
        />

        <TextField
          label="Email *"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />

        <TextField
          label="Password *"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
        />

{!isSelfEdit && (
  <FormControl fullWidth error={!!errors.role}>
    <InputLabel>Role *</InputLabel>
    <Select
      value={role}
      label="Role *"
      onChange={(e) => handleRoleChange(e.target.value)}
    >
      <MenuItem value="">Select Role</MenuItem>
      <MenuItem value="ADMIN">ADMIN</MenuItem>
      <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
      <MenuItem value="READONLY">READONLY</MenuItem>
    </Select>
    <FormHelperText>{errors.role}</FormHelperText>
  </FormControl>
)}


        <div className="col-span-2 text-right">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            sx={{ mt: 2 }}
          >
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>

      {role === 'CUSTOMER' && accounts.length > 0 && (
        <AccountSelector
          accounts={accounts}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          tempSelected={tempSelected}
          setTempSelected={setTempSelected}
          tempDeselected={tempDeselected}
          setTempDeselected={setTempDeselected}
        />
      )}
    </div>
  );
};

export default UserForm;