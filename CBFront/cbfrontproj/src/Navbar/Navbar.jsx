import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectAuth,
  logout,
  switchUser,
  switchBack,
  fetchCustomerEmails
} from '../redux/slices/authSlice';
import {
  LogoutOutlined,
  InfoOutlined,
  SwitchAccountOutlined,
  UndoOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    username, 
    role, 
    token, 
    isImpersonating, 
    customerEmails, 
    isFetchingCustomers 
  } = useSelector(selectAuth);

  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');

  // Fetch customer emails when switch dialog opens
  useEffect(() => {
    if (switchDialogOpen && role === 'ADMIN' && customerEmails.length === 0) {
      dispatch(fetchCustomerEmails());
    }
  }, [switchDialogOpen, dispatch, role, customerEmails.length]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Logout API failed:', err);
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  const handleSwitchUser = async () => {
    if (targetEmail) {
      await dispatch(switchUser(targetEmail));
      setSwitchDialogOpen(false);
      setTargetEmail('');
    }
  };

  const handleSwitchBack = async () => {
    await dispatch(switchBack());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-24 flex justify-between items-center px-12 bg-white border-b border-gray-300 shadow z-[1100]">
      <div className="flex items-center">
        <img src={logo} alt="CloudKeeper Logo" className="h-23 w-40 object-contain" />
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-3">
          <Avatar className="text-blue-800" style={{ fontSize: '2.75rem' }} />
          <div className="flex flex-col justify-center">
            <span className="text-base font-semibold text-gray-700">Welcome</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-blue-800 text-l font-medium">{username}</span>
              <Tooltip
                title={
                  <div className="text-base font-medium px-2 py-1">
                    Role: <span className="capitalize">{role?.toLowerCase()}</span>
                  </div>
                }
                arrow
                placement="bottom"
              >
                <InfoOutlined
                  fontSize="small"
                  className="text-gray-500 hover:text-blue-600 cursor-pointer"
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {role === 'ADMIN' && !isImpersonating && (
          <button
            onClick={() => setSwitchDialogOpen(true)}
            className="flex items-center gap-2 bg-white border border-blue-800 text-blue-800 px-3 py-2 rounded-md font-medium hover:bg-blue-800 hover:text-white transition-all"
          >
            <SwitchAccountOutlined fontSize="small" />
            Switch User
          </button>
        )}

        {isImpersonating && (
          <button
            onClick={handleSwitchBack}
            className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-md font-medium hover:bg-yellow-600 transition-all"
          >
            <UndoOutlined fontSize="small" />
            Switch Back
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white border border-blue-800 text-blue-800 px-3 py-2 rounded-md font-medium hover:bg-blue-800 hover:text-white transition-all"
        >
          <LogoutOutlined fontSize="small" />
          Logout
        </button>
      </div>

      {/* Switch User Dialog */}
      <Dialog open={switchDialogOpen} onClose={() => setSwitchDialogOpen(false)}>
        <DialogTitle>Switch User</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {isFetchingCustomers ? (
            <div className="flex justify-center my-4">
              <CircularProgress />
            </div>
          ) : (
            <FormControl fullWidth margin="dense">
              <InputLabel id="customer-email-select-label">Select Customer Email</InputLabel>
              <Select
                labelId="customer-email-select-label"
                id="customer-email-select"
                value={targetEmail}
                label="Select Customer Email"
                onChange={(e) => setTargetEmail(e.target.value)}
              >
               {customerEmails.map((user) => (
  <MenuItem key={user.id} value={user.email}>
    {user.email}
  </MenuItem>
))}

              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwitchDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSwitchUser} 
            variant="contained" 
            disabled={!targetEmail || isFetchingCustomers}
          >
            Switch
          </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default Navbar;