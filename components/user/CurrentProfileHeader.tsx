"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
// import { auth } from "@/auth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import { AnimatedSubscribeButton } from "../AnimatedSubscribeButton";
import { setSocket } from "@/lib/store/features/socketSlice";

//  This is small card showing current user profile
export default function CurrentProfileHeader() {
  const { data: session } = useSession();
  console.log(session);
  const dispatch = useAppDispatch();
  const [isInvisible, setIsInvisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isConnected = useAppSelector(
    (state) => state.socketContext.isConnected
  );

  const socket = useAppSelector((state) => state.socketContext.socket);

  const onlineUsers = useAppSelector(
    (state) => state.socketContext.onlineUsers
  );

  // Sync local state with server state on component mount and when online users change
  useEffect(() => {
    if (session?.user?.id && onlineUsers?.length > 0) {
      const currentUser = onlineUsers.find(
        (user) => user.userId === session.user.id
      );
      if (currentUser) {
        setIsInvisible(currentUser.isInvisible || false);
      }
    }
  }, [onlineUsers, session?.user?.id]);

  const handleToggleActivityStatus = () => {
    if (socket && !isUpdating) {
      // Only proceed if not already updating
      setIsUpdating(true); // Set updating flag to prevent rapid toggling

      const timeoutId = setTimeout(() => {
        setIsUpdating(false);
      }, 5000);

      if (isConnected) {
        const newVisibilityState = !isInvisible;

        try {
          if (newVisibilityState) {
            socket.emit("setUserInvisible", session?.user?.id);
          } else {
            socket.emit("setUserVisible", session?.user?.id);
          }

          // Add event listener for failed updates
          const handleFailedUpdate = () => {
            clearTimeout(timeoutId);
            setIsUpdating(false);
            // Maybe show an error message to the user
          };

          socket.once("updateFailed", handleFailedUpdate);

          // Clean up the error listener after the timeout
          setTimeout(() => {
            socket.off("updateFailed", handleFailedUpdate);
          }, 1000);
        } catch (error) {
          console.error("Error toggling visibility:", error);
          setIsUpdating(false);
        }
      } else {
        socket.emit("addNewUser", session?.user);
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="h-fit w-full p-3 sm:p-4 rounded-lg border border-muted-lime mt-2 mb-4 flex flex-col md:flex-row items-center md:justify-between gap-3 sm:gap-4">
      {/* Image and User Info */}
      <div className="flex flex-row items-center gap-3 sm:gap-4 w-full md:w-auto overflow-hidden">
        {session?.user?.image ? (
          <Image
            src={session?.user?.image.toString()}
            alt="Profile Picture"
            width={64}
            height={64}
            className="rounded-full mb-0 w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
          />
        ) : (
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center ${
              isConnected
                ? isInvisible
                  ? "bg-red-400"
                  : "bg-shine-lime"
                : "bg-red-500"
            } rounded-full mb-0 flex-shrink-0`}
          >
            <Avatar
              src={session?.user?.image}
              firstLetter={session?.user?.name?.charAt(0).toUpperCase()}
            />
          </div>
        )}

        <div className="text-left overflow-hidden">
          <h1 className="font-semibold text-sm sm:text-base truncate">
            Name: {session?.user?.name}
          </h1>
          <h1 className="text-sm sm:text-base truncate">
            Email: {session?.user?.email}
          </h1>
          <h1 className="text-sm sm:text-base">
            Status:{" "}
            {isConnected ? (isInvisible ? "Invisible" : "Online") : "Offline"}
          </h1>
        </div>
      </div>

      {/* Turn Off Activity Status Button */}
      <div className="w-full md:w-auto mt-3 md:mt-0">
        <AnimatedSubscribeButton
          className={`w-full text-sm sm:text-base ${
            !socket || isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!socket || isUpdating}
        >
          <span
            onClick={
              !socket || isUpdating ? undefined : handleToggleActivityStatus
            }
            className={`text-red-500 block ${
              !socket || isUpdating ? "pointer-events-none h-full w-full bg-gray-300" : ""
            }`}
          >
            {isInvisible
              ? "Turn ON Activity Status"
              : "Turn Off Activity Status"}
          </span>
          <span
            onClick={
              !socket || isUpdating ? undefined : handleToggleActivityStatus
            }
            className={`text-muted-lime block ${
              !socket || isUpdating ? "pointer-events-none" : ""
            }`}
          >
            {isInvisible ? "Currently Invisible" : "Currently Visible"}
          </span>
        </AnimatedSubscribeButton>
      </div>
    </div>
  );
}
