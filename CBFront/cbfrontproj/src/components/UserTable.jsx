import React from 'react';
import { MdModeEdit } from "react-icons/md";
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { MdOutlineCalendarToday, MdOutlineAccessTime } from "react-icons/md";
import RoleFilter from './RoleFilter';

const UserTable = ({ 
  users, 
  isLoading, 
  error, 
  handleEdit, 
  roleFilter, 
  setRoleFilter,
  filterOpen,
  setFilterOpen
}) => {
  return (
    <div className="max-w-full mx-auto px-4 relative right-4">
      <div className="rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead className="bg-blue-100 text-blue-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left w-1/4">Username</th>
                  <th className="px-4 py-2 text-left w-1/4">Email</th>
                  
                  <th className="px-4 py-2 text-left w-1/4 relative">
                    <RoleFilter 
                      roleFilter={roleFilter}
                      setRoleFilter={setRoleFilter}
                      filterOpen={filterOpen}
                      setFilterOpen={setFilterOpen}
                    />
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
  );
};

export default UserTable;