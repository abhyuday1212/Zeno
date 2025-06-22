"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { UserPlus, UserMinus, Loader2, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  cancelled?: boolean;
  sender?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface ActionState {
  [key: string]: "loading" | "completed" | null;
}

// interface SentRequestsProps {
//   isActive: boolean;
// }

export default function SentRequests() {
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [actionStates, setActionStates] = useState<ActionState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    
    
  const fetchSentRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/friend-requests/sent");

      console.log("Sent requests response:", response.data);

      if (response.data.status) {
        setSentRequests(response.data.data || []);
        setError(null);
      } else {
        setSentRequests([]);
        if (response.data.statusCode !== 404) {
          setError(response.data.message);
        } else {
          setError(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch sent friend requests:", err);
      setError("Failed to load sent requests. Please try again later.");
      setSentRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const LoadingState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          Loading sent requests...
        </h3>
      </div>
    ),
    []
  );

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
          onClick={fetchSentRequests}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    ),
    [error]
  );

  const EmptyState = useMemo(
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

  useEffect(() => {
    // if (isActive) {
    fetchSentRequests();
    // }
  }, [fetchSentRequests]);

  const handleCancel = useCallback(async (requestId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [`cancel-${requestId}`]: "loading",
    }));

    try {
      const response = await axios.post(`/api/friend-requests/cancel`, {
        existingRequestId: requestId,
      });

      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }

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

  const handleAddFriend = useCallback(
    async (requestId: string) => {
      setActionStates((prev) => ({ ...prev, [`add-${requestId}`]: "loading" }));

      try {
        const request = sentRequests.find((req) => req.id === requestId);
        if (!request) {
          throw new Error("Request not found");
        }

        const response = await axios.post(`/api/friend-requests/send`, {
          receiverId: request.receiverId,
        });

        if (!response.data.status) {
          toast.error(response.data.message);
          return;
        }

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
    },
    [sentRequests]
  );

  const SentRequestCard = ({ request }: { request: FriendRequest }) => {
    const user = request.receiver;
    if (!user) return null;

    return (
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800">
        <div className="flex items-start space-x-4">
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
                firstLetter={user?.name?.split(" ")[0]?.split("")[0] || "U"}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-card-foreground truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {user.email ||
                    `@${user.name?.toLowerCase().replace(/\s/g, ".")}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(request.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
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
                  disabled={actionStates[`cancel-${request.id}`] === "loading"}
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  //   if (!isActive) return null;

  return (
    <div className="space-y-5">
      {isLoading
        ? LoadingState
        : error
        ? ErrorState
        : sentRequests.length > 0
        ? sentRequests.map((request) => (
            <SentRequestCard key={request.id} request={request} />
          ))
        : EmptyState}
    </div>
  );
}
