"use client";

import { useAppSelector } from "@/lib/store/hooks";
import React from "react";
import ListOnlineUsers from "./user/ListOnlineUsers";

const ConnectionStatus = () => {
  const isConnected = useAppSelector(
    (state) => state.socketContext.isConnected
  );

  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  return (
    <div>
      Socket Status: {isConnected ? "Connected" : "Disconnected"}
      <h1>Online Users</h1>
      {/* <pre>{JSON.stringify(onlineUsers)}</pre> */}
      {/* <ul>
        {onlineUsers.map((user, index) => (
          <li key={index}>
            {user.profile?.name} - {user.profile?.email}
          </li>
        ))}
      </ul> */}
      <ListOnlineUsers />
    </div>
  );
};

export default ConnectionStatus;
