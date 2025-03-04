import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
  username?: string;
}

const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
  username,
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video
        className={cn(
          "rounded border",
          isLocalStream && isOnCall
            ? "w-[200px] h-auto absolute top-0 left-0 z-10 border-2 border-purple-500"
            : "w-[800px] z-0"
        )}
        autoPlay
        playsInline
        ref={videoRef}
        muted={isLocalStream}
      />

      {/* Name label overlay */}
      <div
        className={cn(
          "absolute bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-medium ",
          isLocalStream && isOnCall ? "text-xs top-28 left-0" : "text-base bottom-0 left-0"
        )}
      >
        {username}
      </div>
    </div>
  );
};

export default VideoContainer;
