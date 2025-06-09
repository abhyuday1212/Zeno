"use client";

import VideoCall from "@/components/user/VideoCall";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { setRoomId } from "@/lib/store/features/callSlice";

const VideoCallHome = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const callId = Array.isArray(params.callId)
    ? params.callId[0]
    : params.callId;

  console.log("Call page rendering with ID:", callId);

  // Get current state
  const peer = useAppSelector((state) => state.socketContext.peer);
  const ongoingCall = useAppSelector((state) => state.callContext.ongoingCall);

  // Sync the room ID from URL to Redux if needed
  useEffect(() => {
    if (callId) {
      dispatch(setRoomId(callId));
    }
  }, [callId, dispatch]);

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-xl m-4">Call Room: {callId}</h1>
      <VideoCall />
    </div>
  );
};

export default VideoCallHome;
