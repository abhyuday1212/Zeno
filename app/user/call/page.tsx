import CallNotification from "@/components/callNotification";
import ConnectionStatus from "@/components/SocketStatus";
import { FunctionComponent } from "react";

interface VideoCallProps {}

const VideoCall: FunctionComponent<VideoCallProps> = () => {
  return (
    <div>
      This is video call page.
      <ConnectionStatus />
      <CallNotification />
    </div>
  );
};

export default VideoCall;
