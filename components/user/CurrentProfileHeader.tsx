"use client";

import Image from "next/image";
import React from "react";
// import { auth } from "@/auth";
import { useAppSelector } from "@/lib/store/hooks";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import { AnimatedSubscribeButton } from "../AnimatedSubscribeButton";

//  This is small card showing current user profile
export default function CurrentProfileHeader() {
  const { data: session } = useSession();
  console.log(session);

  const isConnected = useAppSelector(
    (state) => state.socketContext.isConnected
  );

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
              isConnected ? "bg-shine-lime" : "bg-red-500"
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
            Socket Status: {isConnected ? "Online" : "Offline"}
          </h1>
        </div>
      </div>

      {/* Turn Off Activity Status Button */}
      <div className="w-full md:w-auto mt-3 md:mt-0">
        <AnimatedSubscribeButton className="w-full text-sm sm:text-base">
          <span className="text-red-500 block">Turn Off Activity Status</span>
          <span className="text-muted-lime block">Turn ON Activity Status</span>
        </AnimatedSubscribeButton>
      </div>
    </div>
  );
}
