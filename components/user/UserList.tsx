"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Avatar from "../Avatar";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  userType: string;
}

const UserList = () => {
  const [nonFriendUsers, setNonFriendUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/non-friends");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        setNonFriendUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || "User"}
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

                {/* <AddFriendButton userId={user.id} /> */}
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
