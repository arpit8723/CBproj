import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchUsers,
  createUser,
  updateUserThunk,
  selectUsers
} from '../redux/slices/userSlice';
import { selectAuth } from '../redux/slices/authSlice';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { token, role: loggedInRole } = useSelector(selectAuth);
  const { users, isLoading, error } = useSelector(selectUsers);

  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers());
    }
  }, [dispatch, token]);

  const filteredUsers = roleFilter
    ? users.filter(user => user.role === roleFilter)
    : users;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
          token
        })).unwrap();
        // Replace alert with toast
        toast.success(`User ${form.username} updated successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await dispatch(createUser(payload)).unwrap();
        // Replace alert with toast
        toast.success(`User ${form.username} created successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      resetFormState();
      dispatch(fetchUsers());
    } catch (err) {
      // Replace alert with toast for errors
      toast.error(`Account with this E-mail already exists`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEdit = (user) => {
    if (loggedInRole === 'READONLY') return;
    setEditingUser(user);
    setForm({ username: user.username, email: user.email, password: '' });
    setRole(user.role);
    setSelectedAccounts(user.accounts?.map(a => a.id) || []);
    setShowForm(true);
  };

  const resetFormState = () => {
    setForm({ username: '', email: '', password: '' });
    setRole('');
    setSelectedAccounts([]);
    setEditingUser(null);
    setShowForm(false);
  };

  useEffect(() => {
    if (role !== 'CUSTOMER') {
      setSelectedAccounts([]);
    }
  }, [role]);

  return (
    <div className="p-4 max-w-full mx-auto">
      {/* Add ToastContainer to render toasts */}
      <ToastContainer />
      
      {!showForm ? (
        <>
          <div className="flex flex-col items-start gap-3 mb-5">
            <h1 className="text-2xl font-bold">All Users</h1>
            {loggedInRole !== 'READONLY' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                ✚ Add User
              </button>
            )}
          </div>

          {isLoading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              error={error}
              handleEdit={handleEdit}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              canEdit={loggedInRole !== 'READONLY'}
            />
          )}
        </>
      ) : (
        <UserForm
          editingUser={editingUser}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          form={form}
          role={role}
          setRole={setRole}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          resetFormState={resetFormState}
          token={token}
        />
      )}
    </div>
  );
};

export default UserManagement;