"use client";

import { useAppSelector } from "@/lib/store/hooks";
import React from "react";
import Avatar from "./Avatar";

const ListOnlineUsers = () => {
  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  return (
    <div>
      {onlineUsers &&
        onlineUsers.map((user, index) => {
          return (
            <div key={user.userId}>
              <div className="flex items-center gap-2 h-fit mb-2 p-2">
                <Avatar src={user.profile.image} />
                <div className="flex flex-col items-baseline">
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
