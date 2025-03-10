"use client";

import React, { useEffect, useRef, ReactNode, useCallback } from "react";
import { io } from "socket.io-client";
import {
  onConnect,
  onDisconnect,
  setPeer,
  setSocket,
  updateOnlineUsers,
} from "../lib/store/features/socketSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { OngoingCall, Participants, PeerData, SocketUser } from "@/types/index";
import {
  setOngoingCall,
  setParticipants,
} from "@/lib/store/features/callSlice";
import { Socket } from "socket.io";
import { SignalData } from "simple-peer";
import { usePeerConnection } from "@/hooks/usePeerConnection";

const SocketInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const socketRef = useRef(null);
  const { createPeer } = usePeerConnection();

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

  const localstream = useAppSelector(
    (state) => state.socketContext.localStream
  );

  console.log("Local stream..........", localstream);

  const peer = useAppSelector((state) => state.socketContext.peer);

  // const completePeerConnection = useCallback(
  //   async (connectionData: {
  //     sdp: SignalData;
  //     ongoingCall: OngoingCall;
  //     isCaller: boolean;
  //   }) => {
  //     if (!localstream) {
  //       console.error("Local stream not found");
  //       return;
  //     }

  //     if (peer?.peerConnection) {
  //       console.log("Using existing peer connection");
  //       peer.peerConnection.signal(connectionData.sdp);
  //       return;
  //     }

  //     const isInitiator = !connectionData.isCaller;

  //     const newPeer = createPeer(localstream, isInitiator);
  //     const participantUser = connectionData.isCaller
  //       ? connectionData.ongoingCall.participants.caller
  //       : connectionData.ongoingCall.participants.receiver;

  //     const peerData: PeerData = {
  //       peerConnection: newPeer,
  //       participantUser,
  //       stream: null,
  //     };

  //     dispatch(setPeer(peerData));

  //     newPeer.on("signal", async (data: SignalData) => {
  //       if (socket) {
  //         // emit offer
  //         socket.emit("webrtcSignal", {
  //           sdp: data,
  //           ongoingCall: connectionData.ongoingCall,
  //           isCaller: !connectionData.isCaller,
  //         });
  //       }
  //     });

  //   },
  //   [localstream, createPeer, peer, socket, ongoingCall]
  // );

  const handleCallAccepted = useCallback(
    async (callData: OngoingCall) => {
      console.log("Call accepted, creating caller peer connection");

      if (!localstream) {
        console.error("Local stream not found for caller");
        return;
      }

      // Create peer connection for the caller (initiator=true)
      const newPeer = createPeer(localstream, true);

      // Determine the participant user (the receiver in this case)
      const participantUser = callData.participants.receiver;

      const peerData: PeerData = {
        peerConnection: newPeer,
        participantUser: participantUser,
        stream: localstream,
      };

      dispatch(setPeer(peerData));

      // Set up signal handler for the caller side
      newPeer.on("signal", (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall: callData,
            isCaller: true, // This is the caller
          });
        }
      });
    },
    [localstream, createPeer, dispatch, socket]
  );

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
    // socketRef.current.on("webrtcSignal", completePeerConnection);
    socketRef.current.off("callAccepted", handleCallAccepted);

    // Add this new listener
    socketRef.current.on("callAccepted", handleCallAccepted);

    return () => {
      socketRef.current.off("incomingCall", onIncomingCall);
      // socketRef.current.off("webrtcSignal", completePeerConnection);
      socketRef.current.off("callAccepted", handleCallAccepted);
    };
  }, [
    dispatch,
    userId,
    onIncomingCall,
    // completePeerConnection,
    handleCallAccepted,
  ]);

  return <>{children}</>;
};

export default SocketInitializer;
