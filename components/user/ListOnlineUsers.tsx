"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useCallback } from "react";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import { PeerData, SocketUser } from "@/types";
import {
  setOngoingCall,
  setParticipants,
} from "@/lib/store/features/callSlice";
import { setLocalStream, setPeer } from "@/lib/store/features/socketSlice";
import { useMediaStream } from "@/hooks/useMediaStream";
import { usePeerConnection } from "@/hooks/usePeerConnection";

const ListOnlineUsers = () => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const socket = useAppSelector((state) => state.socketContext.socket);

  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === session.user?.id
  );

  const { getMediaStream, localStream } = useMediaStream();

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!currentSocketUser || !socket) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("No stream found");

        return;
      }

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
    <div>
      {onlineUsers &&
        onlineUsers.map((user, index) => {
          // Don't show the current user in the list
          if (user.profile.id === session.user?.id) return null;

          return (
            <div key={user.userId} onClick={() => handleCall(user)}>
              <div className="flex items-center gap-2 h-fit mb-2 p-2">
                <Avatar
                  src={user.profile?.image}
                  firstLetter={user.profile?.name.split(" ")[0].split("")[0]}
                />
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
