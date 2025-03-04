import { useCallback, useRef } from "react";
import Peer from "simple-peer";
import { SignalData } from "simple-peer";
import { useAppDispatch } from "@/lib/store/hooks";
import { setPeer } from "@/lib/store/features/socketSlice";
import { PeerData } from "@/types";

export const usePeerConnection = () => {
  const dispatch = useAppDispatch();
  const peerRef = useRef<Peer.Instance | null>(null);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      // Creating the ice servers configuration
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      // Creating the peer with simple-peer
      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers },
      });

      peerRef.current = peer;

      // Handle stream event to update the remote stream in Redux
      peer.on("stream", (remoteStream) => {
        console.log("Remote stream received", remoteStream);
        // Update the peer in Redux store with the remote stream
        if (peerRef.current) {
          const currentPeer = peerRef.current;
          const updatedPeerData: PeerData = {
            peerConnection: currentPeer,
            participantUser: null, // This will be set by the component that uses this
            stream: remoteStream, // This is the remote stream
          };
          dispatch(setPeer(updatedPeerData));
        }
      });

      // Handle error
      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
      });

      return peer;
    },
    [dispatch]
  );

  const destroyPeer = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  }, []);

  return { createPeer, destroyPeer };
};
