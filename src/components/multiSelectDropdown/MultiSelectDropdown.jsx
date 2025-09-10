"use client";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaXmark } from "react-icons/fa6";

export default function MultiSelectDropdown({ privileges, privilegePostProp }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === privileges.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(privileges.map((item) => item._id));
    }
  };

  const removeTag = (id) => {
    setSelectedIds((prev) => prev.filter((t) => t !== id));
  };

  const filteredOptions = privileges.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    privilegePostProp(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center justify-between border border-gray-300 px-3 py-3 bg-white rounded cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-2">
            {selectedIds.length === 0 ? (
              <span className="text-gray-500">Select the privileges</span>
            ) : (
              <>
                {selectedIds.slice(0, 3).map((id) => {
                  const privilege = privileges.find((p) => p._id === id);
                  return (
                    <span
                      key={id}
                      className="bg-[#1A68B2] text-white px-2 py-1 rounded flex items-center text-sm"
                    >
                      {privilege?.name}
                      <FaXmark
                        className="ml-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(id);
                        }}
                      />
                    </span>
                  );
                })}
                {selectedIds.length > 3 && (
                  <span className="bg-[#1A68B2] text-white px-3 py-1 rounded text-sm">
                    +{selectedIds.length - 3}
                  </span>
                )}
              </>
            )}
          </div>
          <FaChevronDown className="ml-2 text-gray-600" />
        </div>

        {open && (
          <div className="absolute w-full bg-white border border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto mt-1 rounded">
            <div className="flex items-center px-3 py-2">
              <input
                type="text"
                className="w-full border border-gray-200 px-2 py-1 rounded text-sm"
                placeholder="Search privileges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="ml-2 text-gray-500"
                  onClick={() => setSearch("")}
                >
                  <FaXmark />
                </button>
              )}
            </div>

            <div
              className={`cursor-pointer px-4 py-2 text-gray-500 hover:bg-[#1A68B2] hover:text-white ${
                selectedIds.length === privileges.length ? "bg-gray-100" : ""
              }`}
              onClick={handleSelectAll}
            >
              Select All
            </div>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <div
                  key={item._id}
                  className={`cursor-pointer px-4 py-2 text-gray-500 hover:bg-[#1A68B2] hover:text-white ${
                    selectedIds.includes(item._id)
                      ? "bg-[#1A68B2] text-white border-b-1 border-white"
                      : ""
                  }`}
                  onClick={() => toggleSelect(item._id)}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No result match
              </div>
            )}
          </div>
        )}

        {error && selectedIds.length === 0 && (
          <div className="text-red-500 mt-2 text-sm">
            This field is required
          </div>
        )}
      </div>
    </div>
  );
}
