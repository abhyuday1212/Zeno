"use client";

import ConnectionStatus from "@/components/SocketStatus";
import CurrentProfileHeader from "@/components/user/CurrentProfileHeader";
import VideoCall from "@/components/user/VideoCall";
import { FunctionComponent } from "react";

const VideoCallHome: FunctionComponent = () => {
  return (
    <div className="red">
      {/* This is video call page. */}
      {/* Create a You section here */}
      <CurrentProfileHeader />
      <ConnectionStatus />
      {/* <CallNotification /> */}
      <VideoCall />
    </div>
  );
};

export default VideoCallHome;
