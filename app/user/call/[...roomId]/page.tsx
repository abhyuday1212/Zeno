"use client";

import VideoCall from "@/components/user/VideoCall";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { setRoomId } from "@/lib/store/features/callSlice";
import RateExperience from "@/components/ui/rate-experience";
import FeedbackCard from "@/components/user/feedback";
import HomeButton from "@/components/ui/copy-button";
import { useRouter } from "next/navigation";

const VideoCallHome = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;

  console.log("Call page rendering with ID:", roomId);
  const isCallEnded = useAppSelector((state) => state.callContext.isCallEnded);
  // Get current state
  const peer = useAppSelector((state) => state.socketContext.peer);
  const ongoingCall = useAppSelector((state) => state.callContext.ongoingCall);

  // Sync the room ID from URL to Redux if needed
  useEffect(() => {
    if (roomId) {
      dispatch(setRoomId(roomId));
    }
  }, [roomId, dispatch]);

  function handleHomeButtonClick() {
    // Reset the call state when navigating back to home
    dispatch(setRoomId(null));
    router.push("/user/call");
    // dispatch(setOngoingCall({ participants: null, isRinging: false }));
  }

  if (isCallEnded) {
    return (
      <div className="flex flex-col items-center w-full">
        <h1 className="text-xl m-4">Room Id: {roomId}</h1>
        {isCallEnded ? (
          <div className="w-full max-w-3xl flex flex-col items-center m-2 justify-around">
            <p className="text-red-500 mt-2 text-center">Call has ended.</p>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 w-full mb-4">
              <div className="flex flex-row items-center">
                <h1 className="text-sm md:text-base font-medium">Video:</h1>
                <div className="ml-2">
                  <RateExperience category={"Video"} />
                </div>
              </div>
              <div className="flex flex-row items-center">
                <h1 className="text-sm md:text-base font-medium">Audio:</h1>
                <div className="ml-2">
                  <RateExperience category={"Audio"} />
                </div>
              </div>
              <div className="flex flex-row items-center">
                <h1 className="text-sm md:text-base font-medium">
                  Experience:
                </h1>
                <div className="ml-2">
                  <RateExperience category={"Experience"} />
                </div>
              </div>
            </div>
            <div className="w-full max-w-3xl flex flex-col items-center m-2 justify-around">
              <FeedbackCard />
            </div>
            <div className="w-full max-w-3xl flex flex-col items-center m-2 justify-around">
              <HomeButton item={"Home"} func={handleHomeButtonClick} />
            </div>
          </div>
        ) : (
          <VideoCall />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-xl m-4">Room Id: {roomId}</h1>
      <VideoCall />
    </div>
  );
};

export default VideoCallHome;
