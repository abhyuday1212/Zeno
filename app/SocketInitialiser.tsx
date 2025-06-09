"use client";

import React, { useEffect, useRef, ReactNode, useCallback } from "react";
import { io } from "socket.io-client";
import {
  onConnect,
  onDisconnect,
  setLocalStream,
  setPeer,
  setSocket,
  updateOnlineUsers,
} from "../lib/store/features/socketSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { OngoingCall, Participants, PeerData } from "@/types/index";
import {
  resetCallState,
  setIsCallActive,
  setIsCallEnded,
  setOngoingCall,
  setParticipants,
  setRoomId,
} from "@/lib/store/features/callSlice";
import { SignalData } from "simple-peer";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { generateRoomId } from "@/lib/CapitalizeFirstLetter";
import { useRouter } from "next/navigation";

const SocketInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const socketRef = useRef(null);
  const { createPeer } = usePeerConnection();

  const socket = useAppSelector((state) => state.socketContext.socket);
  const router = useRouter();
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // const participants = useAppSelector(
  //   (state) => state.callContext.participants
  // );

  const localstream = useAppSelector(
    (state) => state.socketContext.localStream
  );

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

      const roomId = callData.roomId || generateRoomId(10, true);
      dispatch(setRoomId(roomId));
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
            ongoingCall: {
              ...callData,
              roomId: roomId, // Include the room ID in the call data
            },
            isCaller: true, // This is the caller
          });
        }
      });

      dispatch(setIsCallActive(false));

      router.push(`/user/call/${roomId}`);
      // newPeer.on("stream", (remoteStream) => {
      //   console.log("Received remote stream:", remoteStream);

      //   // Update the peer data with the remote stream
      //   const updatedPeerData = {
      //     ...peerData,
      //     stream: remoteStream,
      //   };
      //   dispatch(setPeer(updatedPeerData));
      // });
    },
    [localstream, createPeer, dispatch, socket, router]
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

    const newSocket = io(window.location.origin, {
      transports: ["websocket"],
    });

    console.log(
      "🚀 -> SocketInitialiser.tsx:157 -> useEffect -> newSocket:",
      newSocket
    );

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

    const handleGetUsers = (users) => {
      dispatch(updateOnlineUsers(users));
    };

    socketRef.current.on("getUsers", handleGetUsers);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("getUsers", handleGetUsers);
      }
    };
  }, [userId, session, dispatch]);

  const handleRemoteHangup = useCallback(() => {
    console.log("Remote user hung up");

    if (peer?.peerConnection) {
      peer.peerConnection.destroy();
    }

    if (localstream) {
      localstream.getTracks().forEach((track) => track.stop());
      dispatch(setLocalStream(null));
    }

    dispatch(setPeer(null));
    dispatch(setLocalStream(null));
    dispatch(setIsCallEnded(true));

    // setTimeout(() => {
    // dispatch(setIsCallEnded(false));
    // dispatch(resetCallState());
    // }, 2000);
  }, [peer, localstream, dispatch]);

  // calls
  useEffect(() => {
    if (!socketRef.current) return;

    const handleWebRTCSignal = (data) => {
      console.log("Received WebRTC signal:", data);

      // Apply the incoming signal to your peer connection
      if (peer?.peerConnection) {
        console.log("Applying signal to existing peer");
        peer.peerConnection.signal(data.sdp);
      } else {
        console.log(
          "No peer connection to apply signal to - THIS IS A PROBLEM"
        );

        // Consider creating a peer connection if one doesn't exist (e.g., for the receiver)
        console.log(
          "This might be a receiver that hasn't created their peer yet"
        );
      }
    };

    const handleCallCancelled = (receivedParticipants) => {
      console.log("Call was cancelled by caller");

      // Now you can access both if needed:
      // receivedParticipants - from socket
      // participants - from Redux state

      dispatch(
        setOngoingCall({
          participants: null,
          isRinging: false,
        })
      );
    };

    socketRef.current.on("incomingCall", onIncomingCall);
    socketRef.current.on("callAccepted", handleCallAccepted);
    socketRef.current.on("webrtcSignal", handleWebRTCSignal);
    socketRef.current.on("hangup", handleRemoteHangup);
    socketRef.current.on("callCancelled", handleCallCancelled);

    return () => {
      socketRef.current.off("incomingCall", onIncomingCall);
      socketRef.current.off("webrtcSignal", handleWebRTCSignal);
      socketRef.current.off("callAccepted", handleCallAccepted);
      socketRef.current.off("hangup", handleRemoteHangup);
      socketRef.current.off("callCancelled", handleCallCancelled);
    };
  }, [
    dispatch,
    userId,
    onIncomingCall,
    // completePeerConnection,
    handleCallAccepted,
    handleRemoteHangup,
    peer,
    // participants,
  ]);

  return <>{children}</>;
};

export default SocketInitializer;
