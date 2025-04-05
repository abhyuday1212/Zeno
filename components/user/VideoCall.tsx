"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useCallback, useEffect } from "react";
import VideoContainer from "./VideoContainer";
import { setCamera, setMic } from "@/lib/store/features/socketSlice";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";
import { useSession } from "next-auth/react";
import {
  resetCallState,
  setIsCallEnded,
  setOngoingCall,
} from "@/lib/store/features/callSlice";
import { setLocalStream, setPeer } from "@/lib/store/features/socketSlice";
import { OngoingCall } from "@/types";

function VideoCall() {
  const localStream = useAppSelector(
    (state) => state.socketContext.localStream
  );
  const isCallEnded = useAppSelector((state) => state.callContext.isCallEnded);
  const isMicOn = useAppSelector((state) => state.socketContext.isMicOn);
  const isVidOn = useAppSelector((state) => state.socketContext.isCameraOn);
  const ongoingCall = useAppSelector(
    (state) => state.socketContext.ongoingCall
  );

  // for call hanngup
  const socket = useAppSelector((state) => state.socketContext.socket);
  const onGoingCall = useAppSelector((state) => state.callContext.ongoingCall);

  const peer = useAppSelector((state) => state.socketContext.peer);

  const { data: session } = useSession();
  const myName = session?.user?.email + " (You)";
  // For remote user, extract name from peer data
  const remoteName = peer?.participantUser?.profile?.email;

  const dispatch = useAppDispatch();

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

  const handleHangup = useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmitHangup?: boolean }) => {
      if (socket && session && data?.ongoingCall && data.isEmitHangup) {
        console.log("Emitting hangup with data:", {
          ongoingCall: data.ongoingCall,
          userHangingUpId: session.user?.id,
        });

        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangingUpId: session.user?.id, // Make sure this is named correctly
        });
      }

      // Destroy peer connection if it exists
      if (peer?.peerConnection) {
        peer.peerConnection.destroy();
      }

      dispatch(setOngoingCall(null));
      dispatch(setPeer(null));

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        dispatch(setLocalStream(null));
      }

      dispatch(setIsCallEnded(true));

      setTimeout(() => {
        dispatch(setIsCallEnded(false));
        dispatch(resetCallState());
      }, 2000);
    },
    [socket, session, localStream, dispatch, peer]
  );

  if (isCallEnded) {
    return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
    // TODO : Add a button to go back to home page and vie the friend list
    // TODO : Add a Rate Experience component here
  }

  if (!localStream && !peer) {
    return null;
  }

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  return (
    <div>
      <div className="mt-4 relative min-w-[450px]">
        {/* Local stream */}
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={true}
            username={myName}
            // Only consider in call if peer stream exists
          />
        )}

        {/* Remote stream first (as background) */}
        {peer?.stream ? (
          <VideoContainer
            stream={peer.stream}
            isLocalStream={false}
            isOnCall={false}
            username={remoteName}
          />
        ) : (
          /* Placeholder when no remote stream */
          <div className="w-full h-[425px] z-0 border-2 bg-gray-800 flex flex-col items-center justify-center">
            <p className="text-white text-lg">Waiting for remote video...</p>
            <p className="text-sm text-gray-400 mt-2">
              {remoteName} hasn't joined yet
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center">
        <button onClick={toggleMic}>
          {isMicOn ? <MdMicOff size={28} /> : <MdMic size={28} />}
        </button>

        <button onClick={toggleCam}>
          {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
        </button>

        <button
          onClick={() => {
            // Handle cancel call
            handleHangup({
              ongoingCall: onGoingCall || null,
              isEmitHangup: true,
            });
          }}
          className="px-4 py-2 bg-rose-500 text-white rounded-md mx-4"
        >
          End Call
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
