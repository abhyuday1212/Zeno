"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react";
import { OngoingCall, PeerData } from "@/types";
import { setOngoingCall, setRoomId } from "@/lib/store/features/callSlice";
import { SignalData } from "simple-peer";
import { setPeer } from "@/lib/store/features/socketSlice";
import { useMediaStream } from "@/hooks/useMediaStream";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { generateRoomId } from "@/lib/CapitalizeFirstLetter";
import { useRouter } from "next/navigation";

const CallNotification = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onGoingCall = useAppSelector((state) => state.callContext.ongoingCall);
  const toastIdRef = useRef<string | number | null>(null);

  const socket = useAppSelector((state) => state.socketContext.socket);

  const { getMediaStream } = useMediaStream();

  const { createPeer } = usePeerConnection();

  // This function is creating the peer connection for receiver
  const handleJoinCall = useCallback(
    async (ongoingCall: OngoingCall) => {
      console.log("Online call...", ongoingCall);

      const roomId = ongoingCall.roomId || generateRoomId(10, true);
      dispatch(setRoomId(roomId));

      dispatch(
        setOngoingCall({
          participants: ongoingCall.participants,
          isRinging: false,
          roomId: roomId,
        })
      );

      // This is the local stream that will be shared with the other person
      const stream = await getMediaStream();

      if (!stream) {
        console.log("Failed to get media stream");
        return;
      }

      // Emit callAccepted event so caller knows to create their peer
      // if (socket) {
      //   socket.emit("callAccepted", ongoingCall);
      // }
      if (socket) {
        socket.emit("callAccepted", {
          participants: ongoingCall.participants,
          roomId: roomId,
          isRinging: false,
        });
      }

      const newPeer = createPeer(stream, false);

      //This stream will come from the other person
      const peerData: PeerData = {
        peerConnection: newPeer,
        participantUser: ongoingCall.participants.caller,
        stream: stream,
      };

      dispatch(setPeer(peerData));

      //The person who emitted signal is the receiver not the caller
      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          // emmit webrtc signal to the server, then the server will emit it to the other person
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall: {
              ...ongoingCall,
              roomId: roomId,
            },
            isCaller: false,
          });
        }
      });

      router.push(`/user/call/${roomId}`);
    },
    [socket, getMediaStream, dispatch, createPeer, router]
  );

  useEffect(() => {
    if (onGoingCall?.isRinging && !toastIdRef.current) {
      toastIdRef.current = toast.custom(
        (t) => (
          <div className="flex flex-col gap-1 px-3 py-2 border border-grey rounded-2xl w-[24rem]">
            <h2 className="text-lg font-semibold">Incoming Call</h2>
            <p className="text-lg">
              {onGoingCall.participants?.caller?.profile?.name || "Someone"} is
              calling...
            </p>
            <i className="text-muted-text text-xs">
              {onGoingCall.participants?.caller?.profile?.email || "Someone"}
            </i>
            <div className="flex gap-2 mt-1 justify-end">
              <button
                onClick={() => {
                  // Handle reject call
                  toast.dismiss(t);
                  toastIdRef.current = null;
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  // Handle accept call
                  handleJoinCall(onGoingCall);
                  toast.dismiss(t);
                  toastIdRef.current = null;
                }}
                className="px-4 py-2 text-shine-lime rounded-md border border-green-1000"
              >
                Accept
              </button>
            </div>
          </div>
        ),
        {
          position: "bottom-right", // Add position here
        }
      );
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  }, [onGoingCall, handleJoinCall]);

  return null;
};

export default CallNotification;
