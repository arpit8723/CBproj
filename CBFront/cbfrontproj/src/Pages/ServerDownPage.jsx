// Pages/ServerDownPage.js
import React from 'react';

const ServerDownPage = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center h-screen text-center px-4">
      <div>
        <h1 className="text-4xl font-bold mb-4">503 - Server Unavailable</h1>
        <p className="mb-6 text-gray-600">The backend server is currently unreachable. Please try again later.</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ServerDownPage;