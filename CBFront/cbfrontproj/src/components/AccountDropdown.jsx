// // components/AccountDropdown.jsx
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { customFetch } from '../Config/CustomFetch';

// const AccountDropdown = ({ selectedAccountId, onSelect }) => {
//   const token = useSelector((state) => state.auth.token);
//   const [accounts, setAccounts] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const res = await customFetch('http://localhost:8080/api/accounts/get', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         setAccounts(Array.isArray(data) ? data : []);
//         if (!selectedAccountId && data.length > 0) {
//           onSelect(data[0].accountNumber);
//         }
//       } catch (err) {
//         console.error('Error fetching accounts:', err.message);
//         setAccounts([]);
//       }
//     };

//     fetchAccounts();  
//   }, [token]);

//   const selectedAccount = accounts.find(acc => acc.accountNumber === selectedAccountId);

//   return (
//     <div className="relative account-dropdown">
//       <div className="p-2">
//         <div className="mb-1">
//           <h2 className="text-base font-medium text-gray-700">Active Account</h2>
//         </div>
//         <div 
//           className="relative border border-gray-300 rounded-md cursor-pointer"
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         >
//           <div className="flex justify-between items-center px-4 py-2">
//             <div>
//               {selectedAccount ? (
//                 <>
//                   <div className="font-medium">{selectedAccount.accountName}</div>
//                   <div className="text-sm text-gray-500">ID: {selectedAccount.accountNumber}</div>
//                 </>
//               ) : (
//                 <div className="text-gray-400">Select Account</div>
//               )}
//             </div>
//             <div className="ml-2">
//               <svg 
//                 className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24" 
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {isDropdownOpen && (
//           <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//             <div className="max-h-60 overflow-y-auto">
//               {accounts.map((account) => (
//                 <div
//                   key={account.accountNumber}
//                   className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//                     selectedAccountId === account.accountNumber ? 'bg-blue-50' : ''
//                   }`}
//                   onClick={() => {
//                     onSelect(account.accountNumber);
//                     setIsDropdownOpen(false);
//                   }}
//                 >
//                   <div className="font-medium">{account.accountName}</div>
//                   <div className="text-sm text-gray-500">ID: {account.accountNumber}</div>
//                 </div>
//               ))}
//               {accounts.length === 0 && (
//                 <div className="px-4 py-2 text-gray-500">No accounts available</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AccountDropdown;
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { customFetch } from '../Config/CustomFetch';

const AccountDropdown = ({ selectedAccountId, onSelect }) => {
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username); // Add username to detect user changes
  const [accounts, setAccounts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch accounts whenever token or username changes
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await customFetch('http://localhost:8080/api/accounts/get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch accounts: ${res.status}`);
        }
        
        const data = await res.json();
        const accountsList = Array.isArray(data) ? data : [];
        setAccounts(accountsList);
        
        // Check if currently selected account is in the fetched accounts list
        const isValidAccount = accountsList.some(acc => acc.accountNumber === selectedAccountId);
        
        // If current account is not valid for this user, select the first available account
        if (!isValidAccount && accountsList.length > 0) {
          onSelect(accountsList[0].accountNumber);
        } else if (!isValidAccount && accountsList.length === 0) {
          // If no accounts are available, clear the selection
          onSelect(null);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err.message);
        setAccounts([]);
        // Clear selection if there's an error
        onSelect(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAccounts();
    }
  }, [token, username]); // Add username to dependency array to refetch when the user changes

  const selectedAccount = accounts.find(acc => acc.accountNumber === selectedAccountId);

  return (
    <div className="relative account-dropdown">
      <div className="p-2">
        <div className="mb-1">
          <h2 className="text-base font-medium text-gray-700">Active Account</h2>
        </div>
        <div 
          className="relative border border-gray-300 rounded-md cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex justify-between items-center px-4 py-2">
            <div>
              {loading ? (
                <div className="text-gray-400">Loading accounts...</div>
              ) : selectedAccount ? (
                <>
                  <div className="font-medium">{selectedAccount.accountName}</div>
                  <div className="text-sm text-gray-500">ID: {selectedAccount.accountNumber}</div>
                </>
              ) : (
                <div className="text-gray-400">No accounts available</div>
              )}
            </div>
            <div className="ml-2">
              <svg 
                className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-2 text-gray-500">Loading accounts...</div>
              ) : accounts.length > 0 ? (
                accounts.map((account) => (
                  <div
                    key={account.accountNumber}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedAccountId === account.accountNumber ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      onSelect(account.accountNumber);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="font-medium">{account.accountName}</div>
                    <div className="text-sm text-gray-500">ID: {account.accountNumber}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No accounts available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDropdown;