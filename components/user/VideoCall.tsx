"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useCallback, useEffect } from "react";
import VideoContainer from "./VideoContainer";
import { setCamera, setMic } from "@/lib/store/features/socketSlice";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

function VideoCall() {
  const localStream = useAppSelector(
    (state) => state.socketContext.localStream
  );
  const isMicOn = useAppSelector((state) => state.socketContext.isMicOn);
  const isVidOn = useAppSelector((state) => state.socketContext.isCameraOn);

  const dispatch = useAppDispatch();

  if (!localStream) {
    return null;
  }
  console.log("localStream....", localStream);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      dispatch(setCamera(videoTrack.enabled));

      const audioTrack = localStream.getAudioTracks()[0];
      dispatch(setMic(audioTrack.enabled));
    }
  }, [localStream]);

  const toggleCam = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];

      videoTrack.enabled = !videoTrack.enabled;

      dispatch(setCamera(videoTrack.enabled));
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];

      audioTrack.enabled = !audioTrack.enabled;

      dispatch(setMic(audioTrack.enabled));
    }
  }, [localStream]);

  return (
    <div>
      <div>
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={false}
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-center">
        <button onClick={toggleMic}>
          {isMicOn ? <MdMicOff size={28} /> : <MdMic size={28} />}
        </button>

        <button onClick={toggleCam}>
          {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
        </button>

        <button className="px-4 py-2 bg-rose-500 text-white rounded-md mx-4">
          End Call
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
