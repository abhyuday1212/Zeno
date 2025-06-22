"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Avatar from "../../Avatar";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  userType: string;
}

interface RequestStatus {
  [userId: string]: {
    isPending: boolean;
    isLoading: boolean;
    requestId?: string; // Store the request ID for cancellation
  };
}

const UserList = () => {
  const [nonFriendUsers, setNonFriendUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/non-friends");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        setNonFriendUsers(users);

        const initialStatus: RequestStatus = {};
        users.forEach((user: User) => {
          initialStatus[user.id] = {
            isPending: false,
            isLoading: false,
          };
        });
        setRequestStatus(initialStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSendFriendRequest = async (userId: string) => {
    // Update loading state
    setRequestStatus((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], isLoading: true },
    }));

    try {
      const response = await axios.post("/api/friend-requests/send", {
        receiverId: userId,
      });

      console.log("Response data:", response.data);

      if (response.data.status) {
        // Update request status to pending and store the request ID
        setRequestStatus((prev) => ({
          ...prev,
          [userId]: {
            isPending: true,
            isLoading: false,
            requestId: response.data.data.id, // The friend request ID from your API
          },
        }));
        toast.success(
          response.data.message || "Friend request sent successfully!"
        );
      } else {
        toast.error(response.data.message || "Failed to send friend request");
        setRequestStatus((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], isLoading: false },
        }));
      }
    } catch (error) {
      console.error("Frontend error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send friend request. Please try again.";
      toast.error(errorMessage);
      setRequestStatus((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isLoading: false },
      }));
    }
  };

  const handleCancelFriendRequest = async (userId: string) => {
    // Update loading state
    setRequestStatus((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], isLoading: true },
    }));

    try {
      const requestId = requestStatus[userId]?.requestId;

      if (!requestId) {
        throw new Error("Request ID not found. Please refresh and try again.");
      }

      // Cancel using the existingRequestId as expected by your API
      const response = await axios.post("/api/friend-requests/cancel", {
        existingRequestId: requestId,
      });

      if (response.data.status) {
        setRequestStatus((prev) => ({
          ...prev,
          [userId]: {
            isPending: false,
            isLoading: false,
            requestId: undefined,
          },
        }));
        toast.success(
          response.data.message || "Friend request cancelled successfully!"
        );
      } else {
        throw new Error(response.data.message || "Failed to cancel request");
      }
    } catch (error) {
      console.error("Cancel request error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel friend request. Please try again.";
      toast.error(errorMessage);
      setRequestStatus((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isLoading: false },
      }));
    }
  };

  // Friend request button component
  const FriendRequestButton = ({ userId }: { userId: string }) => {
    const status = requestStatus[userId] || {
      isPending: false,
      isLoading: false,
    };

    if (status.isPending) {
      return (
        <button
          onClick={() => handleCancelFriendRequest(userId)}
          disabled={status.isLoading}
          className="flex items-center justify-center px-4 py-2 bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-secondary-foreground rounded-lg text-sm font-medium transition-colors duration-200 min-w-[140px]"
        >
          {status.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <UserMinus className="w-4 h-4 mr-2" />
              Cancel Request
            </>
          )}
        </button>
      );
    }

    return (
      <button
        onClick={() => handleSendFriendRequest(userId)}
        disabled={status.isLoading}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 min-w-[140px]"
      >
        {status.isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="mt-2 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            People you may know
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with people you might know on the platform
          </p>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            People you may know
          </h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-card-foreground">
          People you may know
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with people you might know on the platform
        </p>
      </div>

      <div className="divide-y divide-border">
        {nonFriendUsers.length > 0 ? (
          nonFriendUsers.map((user) => (
            <div
              key={user.id}
              className="p-6 hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {user.image ? (
                    <Image
                      src={user?.image}
                      alt={user?.name.split(" ")[0].toLocaleUpperCase()}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-sm"
                    />
                  ) : (
                    <Avatar
                      src={user?.image}
                      firstLetter={
                        user?.name?.split(" ")[0]?.split("")[0] || "U"
                      }
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-card-foreground truncate">
                    {user.name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <FriendRequestButton userId={user.id} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
