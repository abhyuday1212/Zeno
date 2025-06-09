"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useCallback } from "react";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import { SocketUser } from "@/types";
import {
  resetCallState,
  setIsCallActive,
  setOngoingCall,
  setParticipants,
} from "@/lib/store/features/callSlice";
import { useMediaStream } from "@/hooks/useMediaStream";
import { Phone } from "lucide-react";
import CallPopup from "./callPopup";

const ListOnlineUsers = () => {
  const dispatch = useAppDispatch();
  const { getMediaStream, stopMediaStream } = useMediaStream();
  const { data: session } = useSession();

  const socket = useAppSelector((state) => state.socketContext.socket);

  const isCallActive = useAppSelector(
    (state) => state.callContext.isCallActive
  );

  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === session.user?.id
  );

  const callParticipants = useAppSelector(
    (state) => state.callContext.participants
  );

  const handleStartCall = (user) => {
    dispatch(setIsCallActive(true));
    handleCall(user);
  };

  const handleEndCall = () => {
    // Emit callCancelled event to notify the receiver
    socket.emit("callCancelled", callParticipants);

    // clear the media stream
    stopMediaStream();
    dispatch(resetCallState());
    dispatch(setIsCallActive(false));
  };

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!currentSocketUser || !socket) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("No stream found");
        return;
      }

      // set a isCalling state to true
      // Create participants object with proper data
      const participants = {
        caller: {
          ...currentSocketUser,
          socketId: socket.id, // socketId importeennnttt h bhai!
        },
        receiver: {
          ...user,
          socketId: user.socketId, // socketId importeennnttt h bhai!
        },
      };

      // First update the store
      dispatch(setParticipants(participants));
      dispatch(
        setOngoingCall({
          participants,
          isRinging: false,
        })
      );

      // Then emit the event with the complete participants object
      socket.emit("call", participants);
    },
    [currentSocketUser, socket, dispatch, getMediaStream]
  );

  return (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold mb-4">Online Friends🤝 </h1>

      {onlineUsers &&
        onlineUsers.map((user) => {
          // Don't show the current user in the list
          if (user.profile.id === session.user?.id) return null;

          return (
            <div
              key={user.userId}
              className="flex items-center justify-between p-2 mb-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar
                  src={user.profile?.image}
                  firstLetter={user.profile?.name.split(" ")[0].split("")[0]}
                />
                <div className="flex flex-col items-baseline cursor-pointer overflow-hidden">
                  <h1 className="font-medium truncate w-full">
                    {user.profile?.name}
                  </h1>
                  <i className="text-sm text-gray-500 truncate w-full">
                    {user.profile?.email}
                  </i>
                </div>
              </div>
              <button
                onClick={() => handleStartCall(user)}
                className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center flex-shrink-0 ml-2"
              >
                <Phone size={16} className="sm:size-[20px]" />
              </button>

              {isCallActive && (
                <CallPopup
                  name={user.profile?.name || "Unknown User"}
                  email={user.profile?.email}
                  onEndCall={handleEndCall}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ListOnlineUsers;
