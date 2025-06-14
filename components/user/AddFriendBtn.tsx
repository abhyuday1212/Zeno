"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
  useModal,
} from "../ui/animated-modal";
import { FaUserFriends } from "react-icons/fa";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import axios from "axios";

// import { motion } from "motion/react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  userType: string;
  createdAt: string;
  isEmailVerified: boolean;
}

interface PaginatedResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    sizePerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  search: string | null;
}

async function getUsers(searchTerm: string = "", page: number = 1) {
  try {
    const baseUrl =
      process.env.NODE_ENV != "production"
        ? process.env.NEXT_PUBLIC_APP_URL
        : process.env.DEPLOYED_PUBLIC_APP_URL;
    const response = await axios.get(
      `${baseUrl}/api/user/list?pagination=true&sizePerPage=3&page=${page}&search=${encodeURIComponent(
        searchTerm
      )}`
    );

    console.log("Response from getUsers:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function AddFriendModalContent() {
  const { open } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<
    PaginatedResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const placeholders = [
    "Search for friends...",
    "Search by name or email",
    "Didn't find them?",
    "Tell them to join ZENO!",
  ];

  // Clear users when modal closes
  useEffect(() => {
    if (!open) {
      // Modal is closed, clear all data
      setUsers([]);
      setSearchTerm("");
      setCurrentPage(1);
      setPagination(null);
      setLoading(false);
    }
  }, [open]);

  // Fetch users when modal opens
  useEffect(() => {
    if (open) {
      // Modal is opened, fetch fresh data
      resetAndRefresh();
    }
  }, [open]);

  const resetAndRefresh = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchUsers(true);
  };

  useEffect(() => {
    // Only fetch if modal is open
    if (open) {
      fetchUsers();
    }
  }, [currentPage, open]);

  const fetchUsers = async (isReset = false) => {
    try {
      setLoading(true);
      // If resetting, use empty search term regardless of current state
      const term = isReset ? "" : searchTerm;
      const result = await getUsers(term, currentPage);
      setUsers(result.data.users);
      setPagination(result.data.pagination);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  function debounce(fn: Function, delay: number) {
    let timer;
    return function (...args: any) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const debouncedSearch = React.useCallback(
    debounce((searchValue: string) => {
      getUsers(searchValue, 1)
        .then((data) => {
          setUsers(data.data.users);
          setPagination(data.data.pagination);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    setLoading(true); // Set loading state while debounced search is pending

    // Use the debounced search function
    debouncedSearch(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <ModalContent>
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
        Find New friends{" "}
        <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
          Around you
        </span>{" "}
        now! 👻
      </h4>
      {/* search bar */}
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={(e) => handleChange(e)}
        onSubmit={onSubmit}
      />

      {/* Display users */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden mr-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="font-medium dark:text-neutral-100">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
                <button className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-sm rounded-md">
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* {pagination && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-1 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            className="px-3 py-1 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )} */}
    </ModalContent>
  );
}

export function AddFriendBtn() {
  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Find People
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 dark:text-black text-white z-20">
            <FaUserFriends />
          </div>
        </ModalTrigger>
        <ModalBody>
          <AddFriendModalContent />
          <div className="flex justify-end p-4 bg-gray-100 dark:bg-neutral-900"></div>
        </ModalBody>
      </Modal>
    </div>
  );
}
