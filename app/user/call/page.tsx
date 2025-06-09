"use client";

import CurrentProfileHeader from "@/components/user/CurrentProfileHeader";
import ListOnlineUsers from "@/components/user/ListOnlineUsers";
import { FunctionComponent } from "react";

const VideoCallHome: FunctionComponent = () => {
  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <CurrentProfileHeader />
        <ListOnlineUsers />
      </div>
    </div>
  );
};

export default VideoCallHome;
