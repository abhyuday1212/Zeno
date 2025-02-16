"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useCallback } from "react";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import { SocketUser } from "@/types";
import {
  setOngoingCall,
  setParticipants,
} from "@/lib/store/features/callSlice";
import { setLocalStream } from "@/lib/store/features/socketSlice";

const ListOnlineUsers = () => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const socket = useAppSelector((state) => state.socketContext.socket);

  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  const localStream = useAppSelector(
    (state) => state.socketContext.localStream
  );

  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === session.user?.id
  );

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) {
        return localStream;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 400, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });
        dispatch(setLocalStream(stream));
        return stream;
      } catch (error) {
        dispatch(setLocalStream(null));
        return null;
      }
    },
    [localStream]
  );

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
    [currentSocketUser, socket, dispatch]
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
