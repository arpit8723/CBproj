import React from 'react';
import { useSelector } from 'react-redux';
import { MdModeEdit } from "react-icons/md";
import { MdOutlineCalendarToday, MdOutlineAccessTime } from "react-icons/md";
import RoleFilter from './RoleFilter';
import { selectAuth } from '../redux/slices/authSlice'; 

const UserTable = ({ 
  users, 
  handleEdit, 
  roleFilter, 
  setRoleFilter,
  filterOpen,
  setFilterOpen
}) => {
  const { role } = useSelector(selectAuth);

  const showAction = role !== 'READONLY';
  
  
  const getRoleBadgeColor = () => {
   return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="max-w-full mx-auto px-4 relative right-4 mt-6">
      <div className="rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <div className="w-full">
            {/* Header table */}
            <table className="w-full table-fixed">
              <thead className="bg-blue-100 text-blue-800 font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left w-[22%]">Username</th>
                  <th className="px-5 py-3 text-left w-[26%]">Email</th>
                  <th className="px-5 py-3 text-left w-[20%] relative">
                    <RoleFilter 
                      roleFilter={roleFilter}
                      setRoleFilter={setRoleFilter}
                      filterOpen={filterOpen}
                      setFilterOpen={setFilterOpen}
                    />
                  </th>
                  <th className="px-5 py-3 text-left w-[26%]">
                    <div className="flex items-center">Last Login</div>
                  </th>
                  {showAction && (
                    <th className="px-5 py-3 text-center w-[6%]">Action</th>
                  )}
                </tr>
              </thead>
            </table>

            {/* Data table with the same column widths */}
            <div className="min-h-[600px] max-h-[600px] overflow-y-auto">
              <table className="w-full table-fixed">
                <tbody>
                  {users.length > 0 ? (
                    users.map((u, index) => (
                      <tr
                        key={u.id}
                        className={`${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-5 py-3 w-[22%]">{u.username}</td>
                        <td className="px-5 py-3 w-[26%]">{u.email}</td>
                        <td className="px-5 py-3 w-[20%]">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-left w-[26%]"> 
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
                        {showAction && (
                          <td className="px-5 py-3 text-center w-[6%]">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-lg"
                              onClick={() => handleEdit(u)}
                              aria-label="Edit user"
                            >
                              <MdModeEdit />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={showAction ? 5 : 4} className="px-5 py-8 text-center text-gray-500">
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
  );
};

export default UserTable;