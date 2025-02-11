"use client";

import React, { useEffect, useRef, ReactNode, useCallback } from "react";
import { io } from "socket.io-client";
import {
  onConnect,
  onDisconnect,
  setSocket,
  updateOnlineUsers,
} from "../lib/store/features/socketSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { Participants, SocketUser } from "@/types/index";
import {
  setOngoingCall,
  setParticipants,
} from "@/lib/store/features/callSlice";
import { Socket } from "socket.io";

const SocketInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const socketRef = useRef(null);
  const socket = useAppSelector((state) => state.socketContext.socket);

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  const ongoingCall = useAppSelector(
    (state) => state.socketContext.ongoingCall
  );

  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === session?.user?.id
  );

  // const handleCall = useCallback(
  //   (user: SocketUser) => {
  //     if (!currentSocketUser || !socketRef.current) return;

  //     dispatch(setParticipants({ caller: currentSocketUser, receiver: user }));

  //     const participants = useAppSelector(
  //       (state) => state.callContext.participants
  //     );

  //     dispatch(
  //       setOngoingCall({
  //         participants,
  //         isRinging: false,
  //       })
  //     );

  //     socketRef.current.emit("call", participants);
  //   },
  //   [currentSocketUser, ongoingCall, dispatch]
  // );

  const onIncomingCall = useCallback(
    (participants: Participants) => {
      console.log("Incoming call..........", participants);
      if (!participants?.caller || !participants?.receiver) {
        console.error("Invalid participants data received");
        return;
      }

      dispatch(setParticipants(participants));

      dispatch(
        setOngoingCall({
          participants: participants,
          isRinging: true,
        })
      );
    },
    [dispatch]
  );

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // initialise socket
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
    });
    socketRef.current = newSocket;

    // Move connection handlers here
    const handleConnect = () => {
      console.log("Connected with socket:", newSocket.id);
      dispatch(setSocket(newSocket));

      dispatch(onConnect());
    };

    const handleDisconnect = () => {
      dispatch(onDisconnect());
      dispatch(setSocket(null)); // Pass null explicitly
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.disconnect();
    };
  }, [userId, dispatch]);

  // set online users
  useEffect(() => {
    if (!socketRef.current || !userId || !session?.user) return;

    socketRef.current.emit("addNewUser", session.user);

    const handleGetUsers = (users: any) => {
      dispatch(updateOnlineUsers(users));
    };

    socketRef.current.on("getUsers", handleGetUsers);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("getUsers", handleGetUsers);
      }
    };
  }, [userId, session, dispatch]);

  // calls
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("incomingCall", onIncomingCall);

    return () => {
      socketRef.current.off("incomingCall", onIncomingCall);
    };
  }, [dispatch, userId, onIncomingCall]);

  return <>{children}</>;
};

export default SocketInitializer;
