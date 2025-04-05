"use client"

import ConnectionStatus from "@/components/SocketStatus";
import VideoCall from "@/components/user/VideoCall";
import { FunctionComponent } from "react";

interface VideoCallProps {}

const VideoCallHome: FunctionComponent<VideoCallProps> = () => {
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
