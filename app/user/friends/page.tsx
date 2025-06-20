"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, UserMinus, Check, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mutualFriends: number;
  timestamp: string;
}

interface ActionState {
  [key: string]: "loading" | "completed" | null;
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [actionStates, setActionStates] = useState<ActionState>({});

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockReceivedRequests: FriendRequest[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        username: "@sarah.johnson",
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        mutualFriends: 12,
        timestamp: "2 hours ago",
      },
      {
        id: "2",
        name: "Michael Chen",
        username: "@michael.chen",
        avatar:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        mutualFriends: 8,
        timestamp: "5 hours ago",
      },
      {
        id: "3",
        name: "Emma Wilson",
        username: "@emma.wilson",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        mutualFriends: 15,
        timestamp: "1 day ago",
      },
    ];

    const mockSentRequests: FriendRequest[] = [
      {
        id: "4",
        name: "David Rodriguez",
        username: "@david.rodriguez",
        avatar:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        mutualFriends: 6,
        timestamp: "3 hours ago",
      },
      {
        id: "5",
        name: "Lisa Thompson",
        username: "@lisa.thompson",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        mutualFriends: 9,
        timestamp: "6 hours ago",
      },
    ];

    setReceivedRequests(mockReceivedRequests);
    setSentRequests(mockSentRequests);
  }, []);

  const handleAccept = async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`accept-${requestId}`]: "loading",
    }));

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`/api/friends/accept/${requestId}`);

      setReceivedRequests((prev) => prev.filter((req) => req.id !== requestId));
      setActionStates((prev) => ({
        ...prev,
        [`accept-${requestId}`]: "completed",
      }));
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      setActionStates((prev) => ({ ...prev, [`accept-${requestId}`]: null }));
    }
  };

  const handleReject = async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`reject-${requestId}`]: "loading",
    }));

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.delete(`/api/friends/reject/${requestId}`);

      setReceivedRequests((prev) => prev.filter((req) => req.id !== requestId));
      setActionStates((prev) => ({
        ...prev,
        [`reject-${requestId}`]: "completed",
      }));
    } catch (error) {
      console.error("Failed to reject friend request:", error);
      setActionStates((prev) => ({ ...prev, [`reject-${requestId}`]: null }));
    }
  };

  const handleCancel = async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`cancel-${requestId}`]: "loading",
    }));

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.delete(`/api/friends/cancel/${requestId}`);

      setSentRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, cancelled: true } : req
        )
      );
      setActionStates((prev) => ({
        ...prev,
        [`cancel-${requestId}`]: "completed",
      }));
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
      setActionStates((prev) => ({ ...prev, [`cancel-${requestId}`]: null }));
    }
  };

  const handleAddFriend = async (requestId: string) => {
    setActionStates((prev) => ({ ...prev, [`add-${requestId}`]: "loading" }));

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`/api/friends/send/${requestId}`);

      setSentRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, cancelled: false } : req
        )
      );
      setActionStates((prev) => ({
        ...prev,
        [`add-${requestId}`]: "completed",
      }));
    } catch (error) {
      console.error("Failed to send friend request:", error);
      setActionStates((prev) => ({ ...prev, [`add-${requestId}`]: null }));
    }
  };

  const FriendRequestCard = ({
    request,
    type,
  }: {
    request: FriendRequest & { cancelled?: boolean };
    type: "received" | "sent";
  }) => (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={request.avatar}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-background shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime-500 border-2 border-background rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-card-foreground truncate">
                {request.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                {request.username}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">{request.mutualFriends}</span>{" "}
                mutual friends
              </p>
              <p className="text-xs text-muted-foreground">
                {request.timestamp}
              </p>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            {type === "received" ? (
              <>
                <button
                  onClick={() => handleAccept(request.id)}
                  disabled={actionStates[`accept-${request.id}`] === "loading"}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {actionStates[`accept-${request.id}`] === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  disabled={actionStates[`reject-${request.id}`] === "loading"}
                  className="flex-1 bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {actionStates[`reject-${request.id}`] === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {request.cancelled ? (
                  <button
                    onClick={() => handleAddFriend(request.id)}
                    disabled={actionStates[`add-${request.id}`] === "loading"}
                    className="flex-1 bg-lime-600 hover:bg-lime-700 disabled:bg-lime-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {actionStates[`add-${request.id}`] === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Add Friend</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleCancel(request.id)}
                    disabled={
                      actionStates[`cancel-${request.id}`] === "loading"
                    }
                    className="flex-1 bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {actionStates[`cancel-${request.id}`] === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Cancel Request</span>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-2xl px-4 sm:px-4 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">
                    Friend Requests
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your incoming and outgoing friend requests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === "received"
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Received</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                  {receivedRequests.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === "sent"
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Sent</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                  {sentRequests.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Request Lists */}
        <div className="space-y-4">
          {activeTab === "received" ? (
            receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  type="received"
                />
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No friend requests
                </h3>
                <p className="text-muted-foreground">
                  You don&apos;t have any pending friend requests.
                </p>
              </div>
            )
          ) : sentRequests.length > 0 ? (
            sentRequests.map((request) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                type="sent"
              />
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No sent requests
              </h3>
              <p className="text-muted-foreground">
                You haven&apos;t sent any friend requests yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
