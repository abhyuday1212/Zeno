"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Users, UserPlus, UserMinus, Check, X, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    username?: string;
    image?: string;
  };
}

interface ApiResponse<T> {
  statusCode: number;
  data: T | null;
  message: string;
  success: boolean;
}

interface ActionState {
  [key: string]: "loading" | "completed" | null;
}

export default function FriendsClient() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [actionStates, setActionStates] = useState<ActionState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch received friend requests from API
  useEffect(() => {
    const fetchReceivedRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<ApiResponse<FriendRequest[]>>(
          "/api/friend-requests/received"
        );

        if (response.data.success) {
          setReceivedRequests(response.data.data || []);
        } else {
          // If API returns a non-success response but it's expected (like 404 for no requests)
          setReceivedRequests([]);
          if (response.data.statusCode !== 404) {
            setError(response.data.message);
          }
        }
      } catch (err) {
        console.error("Failed to fetch received friend requests:", err);
        setError("Failed to load friend requests. Please try again later.");
        setReceivedRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "received") {
      fetchReceivedRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "sent") {
      // Mock data for sent requests
      const mockSentRequests: FriendRequest[] = [
        {
          id: "4",
          senderId: "current-user-id",
          receiverId: "receiver-id-1",
          status: "PENDING",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          sender: {
            id: "receiver-id-1",
            name: "David Rodriguez",
            username: "@david.rodriguez",
            image:
              "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
          },
        },
        {
          id: "5",
          senderId: "current-user-id",
          receiverId: "receiver-id-2",
          status: "PENDING",
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          sender: {
            id: "receiver-id-2",
            name: "Lisa Thompson",
            username: "@lisa.thompson",
            image:
              "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
          },
        },
      ];

      setSentRequests(mockSentRequests);
    }
  }, [activeTab]);

  // Wrapping handler functions with useCallback to prevent unnecessary re-renders
  const handleAccept = useCallback(async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`accept-${requestId}`]: "loading",
    }));

    try {
      // Implement actual API call for accepting request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`/api/friend-requests/${requestId}/accept`);

      setReceivedRequests((prev) => prev.filter((req) => req.id !== requestId));
      setActionStates((prev) => ({
        ...prev,
        [`accept-${requestId}`]: "completed",
      }));
      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      toast.error("Failed to accept friend request. Please try again.");
      setActionStates((prev) => ({ ...prev, [`accept-${requestId}`]: null }));
    }
  }, []);

  const handleReject = useCallback(async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`reject-${requestId}`]: "loading",
    }));

    try {
      // Implement actual API call for rejecting request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`/api/friend-requests/${requestId}/reject`);

      setReceivedRequests((prev) => prev.filter((req) => req.id !== requestId));
      setActionStates((prev) => ({
        ...prev,
        [`reject-${requestId}`]: "completed",
      }));
      toast.success("Friend request deleted");
    } catch (error) {
      console.error("Failed to reject friend request:", error);
      toast.error("Failed to delete friend request. Please try again.");
      setActionStates((prev) => ({ ...prev, [`reject-${requestId}`]: null }));
    }
  }, []);

  const handleCancel = useCallback(async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`cancel-${requestId}`]: "loading",
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.delete(`/api/friend-requests/${requestId}`);

      setSentRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, cancelled: true } : req
        )
      );
      setActionStates((prev) => ({
        ...prev,
        [`cancel-${requestId}`]: "completed",
      }));
      toast.success("Friend request cancelled");
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
      toast.error("Failed to cancel friend request. Please try again.");
      setActionStates((prev) => ({ ...prev, [`cancel-${requestId}`]: null }));
    }
  }, []);

  const handleAddFriend = useCallback(async (requestId: string) => {
    setActionStates((prev) => ({ ...prev, [`add-${requestId}`]: "loading" }));

    try {
      // Implement actual API call for sending request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`/api/friend-requests/send`, { receiverId: ... });

      setSentRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, cancelled: false } : req
        )
      );
      setActionStates((prev) => ({
        ...prev,
        [`add-${requestId}`]: "completed",
      }));
      toast.success("Friend request sent");
    } catch (error) {
      console.error("Failed to send friend request:", error);
      toast.error("Failed to send friend request. Please try again.");
      setActionStates((prev) => ({ ...prev, [`add-${requestId}`]: null }));
    }
  }, []);

  // Helper function to format relative time
  const formatRelativeTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }, []);

  const FriendRequestCard = useMemo(() => {
    const Card = ({
      request,
      type,
    }: {
      request: FriendRequest & { cancelled?: boolean };
      type: "received" | "sent";
    }) => {
      const user = request.sender;
      if (!user) return null;

      return (
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Image
                src={user.image || "/default-avatar.png"}
                alt={user.name || "User"}
                width={150}
                height={150}
                className="w-16 h-16 rounded-full object-cover border-2 border-background shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime-500 border-2 border-background rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {user.username ||
                      `@${user.name?.toLowerCase().replace(/\s/g, ".")}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(request.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                {type === "received" ? (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      disabled={
                        actionStates[`accept-${request.id}`] === "loading"
                      }
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
                      disabled={
                        actionStates[`reject-${request.id}`] === "loading"
                      }
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
                        disabled={
                          actionStates[`add-${request.id}`] === "loading"
                        }
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
    };

    Card.displayName = "FriendRequestCard";

    return Card;
  }, [
    actionStates,
    handleAccept,
    handleReject,
    handleCancel,
    handleAddFriend,
    formatRelativeTime,
  ]);

  const EmptyReceivedState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          No friend requests
        </h3>
        <p className="text-muted-foreground">
          You don&apos;t have any pending friend requests.
        </p>
      </div>
    ),
    []
  );

  const EmptySentState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          No sent requests
        </h3>
        <p className="text-muted-foreground">
          You haven&apos;t sent any friend requests yet.
        </p>
      </div>
    ),
    []
  );

  // Loading state
  const LoadingState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          Loading friend requests...
        </h3>
      </div>
    ),
    []
  );

  // Error state
  const ErrorState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          Error loading requests
        </h3>
        <p className="text-muted-foreground">
          {error || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => setActiveTab(activeTab)} // Refresh the current tab
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    ),
    [error, activeTab]
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Tabs */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-2">
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

        {/* Received Requests Tab */}
        {activeTab === "received" && (
          <div className="space-y-2">
            {isLoading
              ? LoadingState
              : error
              ? ErrorState
              : receivedRequests.length > 0
              ? receivedRequests.map((request) => (
                  <FriendRequestCard
                    key={request.id}
                    request={request}
                    type="received"
                  />
                ))
              : EmptyReceivedState}
          </div>
        )}

        {/* Sent Requests Tab */}
        {activeTab === "sent" && (
          <div className="space-y-5">
            {sentRequests.length > 0
              ? sentRequests.map((request) => (
                  <FriendRequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                  />
                ))
              : EmptySentState}
          </div>
        )}
      </div>
    </div>
  );
}
