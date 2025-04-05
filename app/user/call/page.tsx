"use client"

import ConnectionStatus from "@/components/SocketStatus";
import VideoCall from "@/components/user/VideoCall";
import { FunctionComponent } from "react";


const VideoCallHome: FunctionComponent = () => {
  return (
    <div>
      This is video call page.
      <ConnectionStatus />
      {/* <CallNotification /> */}
      <VideoCall />
    </div>
  );
};

export default VideoCallHome;
