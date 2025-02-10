import ConnectionStatus from "@/components/SocketStatus";
import { FunctionComponent } from "react";

interface VideoCallProps {}

const VideoCall: FunctionComponent<VideoCallProps> = () => {
  return (
    <div>
      This is video call page.
      <ConnectionStatus />
    </div>
  );
};

export default VideoCall;
