import React from 'react';
import {
  IconButton
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';

const AccountSelector = ({
  accounts,
  selectedAccounts,
  setSelectedAccounts,
  tempSelected,
  setTempSelected,
  tempDeselected,
  setTempDeselected
}) => {
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

  return (
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
  );
};

export default AccountSelector;