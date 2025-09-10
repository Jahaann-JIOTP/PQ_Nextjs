"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import config from "../../../constants/apiRouteList";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [editUserPopup, setEditUserPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [editUserData, setEditUserData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
    console.log("Token from localStorage:", token);
  }, []);
  console.log("Auth Token:", authToken);

  useEffect(() => {
    if (authToken) {
      fetchUsers();
      fetchRoles();
    }
  }, [authToken]);
  console.log("Users state updated:", users);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}${config.USER.ALL_USERS}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("ALL_USERS API response:", res.data);
      setUsers(res.data);
    
      if (!searchTerm) {
        setFilteredUsers(res.data);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch users!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}${config.ROLES.GET_ALL_ROLLS}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setRoles(res.data.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch roles!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${config.BASE_URL}${config.USER.DELETE_USER.replace(
              ":id",
              user._id
            )}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
              data: {
                name: user.name,
                email: user.email,
                role: user.role,
              },
            }
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been removed successfully",
          });
          fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete user!",
          });
        }
      }
    });
  };

  const handleUpdateUser = async () => {
    try {
      await axios.patch(
        `${config.BASE_URL}${config.USER.UPDATE_USER.replace(
          ":id",
          editUserData._id
        )}`,
        {
          name: editUserData.name,
          email: editUserData.email,
          password: editUserData.password,
          roleId: editUserData.role,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User updated Successfully",
      });
      setEditUserPopup(false);
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update user!",
      });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      `${user.name} ${user.email} ${user.role?.name || ""}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    handleSort(sortConfig.key, sortConfig.direction, filtered);
  };

  const handleSort = (
    key,
    directionOverride = null,
    userList = filteredUsers
  ) => {
    let direction = directionOverride || "asc";
    if (
      !directionOverride &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...userList].sort((a, b) => {
      let valA = a[key] || "";
      let valB = b[key] || "";

      if (typeof valA === "object") valA = valA.name;
      if (typeof valB === "object") valB = valB.name;

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSortUp className="inline-block ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline-block ml-1 text-[#1F5897]" />
    ) : (
      <FaSortDown className="inline-block ml-1 text-[#1F5897]" />
    );
  };

  return (
    <div>
      {/* Search Input */}
      <div className="flex justify-end items-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 shadow-sm focus:outline-[#1F5897]"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-md border border-gray-300">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-[#1A68B252] text-[#1A68B2] font-[600] font-[Raleway] text-[15.34px] leading-[125%] h-[45px]">
            <tr>
              <th className="px-4 py-3 text-left">Sr No</th>
              <th className="px-4 py-3 text-left">User Name</th>
              <th className="px-4 py-3 text-left">User Email</th>
              <th className="px-4 py-3 text-left">User Role</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [1, 2].map((_, index) => (
                  <tr key={index} className="animate-pulse h-[45px]">
                    <td className="px-4 py-2">
                      <div className="h-[40px] w-full bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-[40px] w-full bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-[40px] w-full bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-[40px] w-full bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-[40px] w-full bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))
              : filteredUsers.map((user, i) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50 transition duration-150 ease-in-out h-[45px]"
                  >
                    <td className="px-4 py-2 border border-gray-300 font-bold">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {roles.find((r) => r._id === user.role)?.name ||
                        user?.role?.name ||
                        "N/A"}
                    </td>

                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <div className="flex justify-center gap-3">
                        {/* Edit */}
                        <button
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => {
                            setEditUserData({
                              _id: user._id,
                              name: user.name,
                              email: user.email,
                              role:
                                roles.find((r) => r.name === user?.role?.name)
                                  ?._id || "",
                            });

                            setEditUserPopup(true);
                          }}
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M5 16.0002L4 20.0002L8 19.0002L19.586 7.41419C19.9609 7.03913 20.1716 6.53051 20.1716 6.00019C20.1716 5.46986 19.9609 4.96124 19.586 4.58619L19.414 4.41419C19.0389 4.03924 18.5303 3.82861 18 3.82861C17.4697 3.82861 16.9611 4.03924 16.586 4.41419L5 16.0002Z"
                                stroke="#1A68B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5 16L4 20L8 19L18 9L15 6L5 16Z"
                                fill="#1A68B2"
                              />
                              <path
                                d="M15 6L18 9M13 20H21"
                                stroke="#1A68B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                        </button>

                        {/* Delete */}
                        <button
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"
                                fill="#D90505"
                              />
                            </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUserPopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] flex items-center justify-center z-50">
          <div className="bg-white rounded-[8px] shadow-lg border-2 border-gray-300 w-[400px] p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit User</h2>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={editUserData.password}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleUpdateUser}
                className="bg-[#1F5897] text-white font-medium px-4 py-2 rounded-md cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditUserPopup(false)}
                className="bg-gray-500 text-white font-medium px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
