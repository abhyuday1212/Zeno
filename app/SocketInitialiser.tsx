"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import {
  onConnect,
  onDisconnect,
  updateOnlineUsers,
} from "../lib/store/features/socketSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { SocketUser } from "@/types";

const SocketInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Create a new socket instance and store it in a ref
    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    // Register event handlers
    const handleConnect = () => {
      console.log("Connected to socket", socket.id);
      socket.emit("addNewUser", session?.user);
      dispatch(onConnect());
    };

    const handleDisconnect = () => {
      console.log("Disconnected from socket");
      dispatch(onDisconnect());
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    // Listen for online users list from the server
    socket.on("getUsers", (onlineUsers: any) => {
      console.log("Online users:", onlineUsers);
      dispatch(updateOnlineUsers(onlineUsers));
    });

    // Clean up on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("getUsers");
      socket.disconnect();
    };
  }, [userId, dispatch]);

  return <>{children}</>;
};

export default SocketInitializer;
