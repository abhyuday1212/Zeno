import { useCallback, useRef } from "react";
import Peer from "simple-peer";
import { useAppDispatch } from "@/lib/store/hooks";
import { setPeer } from "@/lib/store/features/socketSlice";
import { PeerData } from "@/types";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// async function createToken() {
//   const token = await client.tokens.create();

//   console.log(token.accountSid);
//   return token;
// }


export const usePeerConnection = () => {
  const dispatch = useAppDispatch();
  const peerRef = useRef<Peer.Instance | null>(null);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      // Define separate ICE server lists
      const stunServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      const turnServers: RTCIceServer[] = [
        {
          username: process.env.NEXT_PUBLIC_TWILIO_TURN_USERNAME_1,
          credential: process.env.NEXT_PUBLIC_TWILIO_TURN_CREDENTIAL_1,
          urls: process.env.NEXT_PUBLIC_TWILIO_TURN_URLS_1,
        },
        {
          username: process.env.NEXT_PUBLIC_TWILIO_TURN_USERNAME_2,
          credential: process.env.NEXT_PUBLIC_TWILIO_TURN_CREDENTIAL_2,
          urls: process.env.NEXT_PUBLIC_TWILIO_TURN_URLS_2,
        },
        {
          username: process.env.NEXT_PUBLIC_TWILIO_TURN_USERNAME_3,
          credential: process.env.NEXT_PUBLIC_TWILIO_TURN_CREDENTIAL_3,
          urls: process.env.NEXT_PUBLIC_TWILIO_TURN_URLS_3,
        },
      ];

      // Initially use STUN servers only
      let iceServersConfig: RTCIceServer[] = [...stunServers];
      let retryAttempted = false;

      // Helper to create a new Peer with the given ICE config
      const buildPeer = (iceConfig: RTCIceServer[]) => {
        const newPeer = new Peer({
          stream,
          initiator,
          trickle: true,
          config: { iceServers: iceConfig },
        });

        // Handle remote stream
        newPeer.on("stream", (remoteStream) => {
          console.log("Remote stream received", remoteStream);
          const updatedPeerData: PeerData = {
            peerConnection: newPeer,
            participantUser: null, // To be set by the caller
            stream: remoteStream,
          };
          dispatch(setPeer(updatedPeerData));
        });

        // Error handling: on error, attempt a retry with TURN if not already done
        newPeer.on("error", (err) => {
          console.error("Peer connection error:", err);
          if (!retryAttempted) {
            retryAttempted = true;
            console.log("Retrying peer connection with TURN servers...");
            // Destroy the current peer
            newPeer.destroy();
            // Combine STUN and TURN servers and create a new peer
            iceServersConfig = [...stunServers, ...turnServers];
            const retriedPeer = buildPeer(iceServersConfig);
            // Update the peerRef with the new peer, so any future hook calls can access it
            peerRef.current = retriedPeer;
            // Optionally, notify upstream (via an event or callback) so that external listeners can reattach events.
          }
        });

        return newPeer;
      };

      const peer = buildPeer(iceServersConfig);
      peerRef.current = peer;
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
