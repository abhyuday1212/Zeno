"use client";

import { useAppSelector } from "@/lib/store/hooks";
import React from "react";
import Avatar from "./Avatar";
import { useSession } from "next-auth/react";

const ListOnlineUsers = () => {
  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  const { data: session, status } = useSession();

  return (
    <div>
      {onlineUsers &&
        onlineUsers.map((user, index) => {
          // Don't show the current user in the list
          if (user.profile.id === session.user?.id) return null;

          return (
            <div key={user.userId}>
              <div className="flex items-center gap-2 h-fit mb-2 p-2">
                <Avatar src={null} firstLetter={user.profile?.name.split(" ")[0].split("")[0]} />
                <div className="flex flex-col items-baseline cursor-pointer">
                  <h1> {user.profile?.name}</h1>
                  <i>{user.profile?.email}</i>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ListOnlineUsers;
