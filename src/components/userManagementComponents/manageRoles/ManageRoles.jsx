"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../constants/apiRouteList";
import MultiSelectDropdown from "@/components/multiSelectDropdown/MultiSelectDropdown";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [token, setToken] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [editRolePopup, setEditRolePopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editPrivileges, setEditPrivileges] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPrivilegesId = (ids) => {
  // Debug: log selected privilege IDs
  console.log("Selected Privileges (from dropdown):", ids);
  setSelectedPrivileges(ids);
  };

  useEffect(() => {
    setToken(localStorage.getItem("authToken")); // ✅ same token jo login me save kiya tha
  }, []);

  useEffect(() => {
    if (token) {
      fetchRoles();
      fetchPrivileges();
    }
  }, [token]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [roles]);

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}${config.ROLES.GET_ALL_ROLLS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const rawRoles = res.data?.data || []; // API structure fix
      setRoles(rawRoles);
      setFilteredRoles(rawRoles);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch roles!",
      });
    }
  };

  // ✅ Fetch Privileges
  const fetchPrivileges = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}${config.PRIVILEGES.GET_ALL_PRIVILEGES}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Fix: privileges API returns array, not { data: [...] }
      setPrivileges(Array.isArray(res.data) ? res.data : res.data?.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch privileges!",
      });
    }
  };

  // ✅ Add Role
  const handleAddRole = async () => {
    if (!newRole.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a role name.",
        confirmButtonColor: "#655CCA",
      });
      return;
    }

    // Ensure privilege IDs are always strings
    const privilegeIds = selectedPrivileges.map((id) =>
      typeof id === "object" && id._id ? id._id : String(id)
    );
    // Debug: log privilege IDs being sent to API
    console.log("Sending privilege IDs to API:", privilegeIds);

    try {
      // 1. Create the role (without privileges)
      const res = await axios.post(
        `${config.BASE_URL}${config.ROLES.ADD_ROLE}`,
        {
          name: newRole,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 2. Get the new role's ID
      let newRoleId = res.data?.data?._id || res.data?._id;
      // If not in response, fallback to refetching roles and finding by name
      if (!newRoleId) {
        await fetchRoles();
        const found = roles.find(r => r.name === newRole);
        newRoleId = found?._id;
      }
      if (!newRoleId) throw new Error("Could not determine new role ID");

      // 3. Assign privileges to the new role
      await axios.put(
        `${config.BASE_URL}${config.ROLES.ASSIGN_PRIVILEGES.replace(":id", newRoleId)}`,
        {
          privellegeNames: privilegeIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Role Created & Privileges Assigned!",
      });
      setNewRole("");
      setSelectedPrivileges([]);
      setShowRolePopup(false);
      setTimeout(() => {
        setSelectedPrivileges([]); // Ensure dropdown is reset after modal closes
      }, 300);
      fetchRoles();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Failed to create role or assign privileges!",
      });
    }
  };

  // ✅ Assign Privileges to Role (new API)
  const handleAssignPrivileges = async () => {
    if (!editRole || editPrivileges.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select at least one privilege",
      });
      return;
    }
    const privilegeIds = editPrivileges.map((id) =>
      typeof id === "object" && id._id ? id._id : String(id)
    );
    try {
      await axios.put(
        `${config.BASE_URL}${config.ROLES.ASSIGN_PRIVILEGES.replace(":id", editRole._id)}`,
        {
          privellegeNames: privilegeIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Privileges assigned successfully!",
      });
      setEditRolePopup(false);
      fetchRoles();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to assign privileges!",
      });
    }
  };

  // ✅ Delete Role
  const handleDeleteRole = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${config.BASE_URL}${config.ROLES.DELETE_ROLE.replace(":id", id)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchRoles();
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Role has been removed.",
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Failed to delete role!",
          });
        }
      }
    });
  };

  // ✅ Search
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = roles.filter((role) => {
      const privilegeNames = (role.privelleges || role.privileges || [])
        .map((id) => {
          const found = privileges.find((p) => p._id === id);
          return found ? found.name : null;
        })
        .filter(Boolean)
        .join(" ");
      return `${role.name} ${privilegeNames}`
        .toLowerCase()
        .includes(term.toLowerCase());
    });
    setFilteredRoles(filtered);
  };



  const getPrivilegeNames = (privilegeIds, privileges) => {
    const ids = (privilegeIds || []).map((id) =>
      typeof id === "object" && id._id ? id._id : String(id)
    );
    return ids
      .map((id) => {
        const found = privileges.find((p) => p._id === id);
        return found ? found.name : null;
      })
      .filter(Boolean);
  };

  return (
    <div>
      {/* Add Role Button */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setShowRolePopup(true)}
          className="bg-[#1F5897] text-white px-4 py-2 cursor-pointer rounded-md hover:bg-[#17406c]"
        >
          + Add Role
        </button>
      </div>

      {/* Search Input */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search roles..."
          className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 shadow-sm focus:outline-[#1F5897]"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-md border border-gray-300">
        <table className="min-w-full text-sm text-gray-800 border border-gray-300">
          <thead className="bg-[#1A68B252] text-[#1A68B2] font-[600] text-[15.34px] leading-[125%] h-[45px] border">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Privileges</th>
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
                  </tr>
                ))
              : filteredRoles.map((role, i) => {
                  // Always use 'privelleges' key from API response
                  let privilegeIds = role.privelleges || [];
                  // Normalize privilegeIds to array of strings
                  privilegeIds = (privilegeIds || []).map((id) =>
                    typeof id === "object" && id._id ? id._id : String(id)
                  );
                  const privilegeNames = getPrivilegeNames(privilegeIds, privileges).join(", ");

                  return (
                    <tr
                      key={role._id}
                      className="hover:bg-blue-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-2 border">{i + 1}</td>
                      <td className="px-4 py-2 border">{role.name}</td>
                      <td className="px-4 py-2 border">{privilegeNames || <span className="text-gray-400">No Privileges</span>}</td>
                      <td className="px-4 py-2 border text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => {
                              setEditRole(role);
                              setEditPrivileges([...privilegeIds]);
                              setEditRolePopup(true);
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
                          <button
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => handleDeleteRole(role._id)}
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
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Add Role Modal */}
      {showRolePopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] flex items-center justify-center z-200">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-[60vh]">
            <p className="text-black text-[27px] font-semibold mb-6">
              Add New Role
            </p>
            <div className="flex flex-col justify-between h-[86%]">
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Role Name"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5897]"
                />
                <MultiSelectDropdown
                  privileges={privileges}
                  privilegePostProp={getPrivilegesId}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleAddRole}
                  className="bg-[#1d5998] text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowRolePopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editRolePopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] flex items-center justify-center z-200">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
            <p className="text-black text-[27px] font-semibold mb-6">
              Edit Role: {editRole?.name}
            </p>
            <div className="space-y-3 mb-6">
              <div className="text-gray-700 font-semibold">Update Privileges:</div>
              <div className="grid grid-cols-2 gap-2">
                {privileges.map((p) => (
                  <label key={p._id} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      checked={editPrivileges.includes(p._id)}
                      onChange={() =>
                        setEditPrivileges((prev) =>
                          prev.includes(p._id)
                            ? prev.filter((id) => id !== p._id)
                            : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleAssignPrivileges}
                className="bg-[#1d5998] text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditRolePopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer"
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
