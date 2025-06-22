// components/user/friendsTab/MyFriends.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Loader2, X, Heart } from "lucide-react";
import Image from "next/image";
import Avatar from "@/components/Avatar";

interface Friend {
  id: string;
  friendId: string;
  createdAt: string;
  friend: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface ApiResponse<T> {
  statusCode: number;
  data: T | null;
  message: string;
  status: boolean;
}


export default function MyFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<ApiResponse<Friend[]>>("/api/friends");
      if (response.data.status) {
        setFriends(response.data.data || []);
      } else {
        // treat 404 as empty
        if (response.data.statusCode === 404) {
          setFriends([]);
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err.message || "Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const LoadingState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          Loading your friends…
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
          Error loading friends
        </h3>
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={fetchFriends}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    ),
    [error, fetchFriends]
  );

  const EmptyState = useMemo(
    () => (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          No friends yet
        </h3>
        <p className="text-muted-foreground">
          You haven’t added any friends. Try connecting with some suggested
          users!
        </p>
      </div>
    ),
    []
  );

  if (isLoading) return LoadingState;
  if (error) return ErrorState;
  if (friends.length === 0) return EmptyState;

  return (
    <div className="space-y-5">
      {friends.map(({ id, friend, createdAt }) => (
        <div
          key={id}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
        >
          <div className="flex items-center space-x-4">
            {friend.image ? (
              <Image
                src={friend?.image}
                alt={friend?.name.split(" ")[0].toLocaleUpperCase()}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-sm"
              />
            ) : (
              <Avatar
                src={friend?.image}
                firstLetter={friend?.name?.split(" ")[0]?.split("")[0] || "U"}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-card-foreground truncate">
                {friend.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {friend.email ||
                  `@${friend.name.toLowerCase().replace(/\s/g, ".")}`}
              </p>
              <p className="text-xs text-muted-foreground">
                Friends since {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
