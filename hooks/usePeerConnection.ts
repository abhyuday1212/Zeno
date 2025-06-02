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

// xxxxxxxxx TURN servers connection xxxxxxxxxxxxxxxx

// import { useCallback, useRef } from "react";
// import Peer from "simple-peer";
// import { useAppDispatch } from "@/lib/store/hooks";
// import { setPeer } from "@/lib/store/features/socketSlice";
// import { PeerData } from "@/types";

// export const usePeerConnection = () => {
//   const dispatch = useAppDispatch();
//   const peerRef = useRef<Peer.Instance | null>(null);

//   const createPeer = useCallback(
//     (stream: MediaStream, initiator: boolean) => {
//       // Define ICE server configurations using Twilio's STUN and TURN servers
//       //  urls: [
//       //       "stun:stun.l.google.com:19302",
//       //       "stun:stun1.l.google.com:19302",
//       //       "stun:stun2.l.google.com:19302",
//       //       "stun:stun3.l.google.com:19302",
//       //     ],
//       const stunServers: RTCIceServer[] = [
//         {
//           urls: "stun:global.stun.twilio.com:3478",
//         },
//       ];

//       const turnServers: RTCIceServer[] = [
//         {
//           urls: process.env.NEXT_PUBLIC_TWILIO_TURN_URLS_1!,
//           username: process.env.NEXT_PUBLIC_TWILIO_TURN_USERNAME_1!,
//           credential: process.env.NEXT_PUBLIC_TWILIO_TURN_CREDENTIAL_1!,
//         },
//         {
//           urls: process.env.NEXT_PUBLIC_TWILIO_TURN_URLS_2!,
//           username: process.env.NEXT_PUBLIC_TWILIO_TURN_USERNAME_2!,
//           credential: process.env.NEXT_PUBLIC_TWILIO_TURN_CREDENTIAL_2!,
//         },
//         {
//           urls: process.env.NEXT_PUBLIC_TWILIO_TURN_URLS_3!,
//           username: process.env.NEXT_PUBLIC_TWILIO_TURN_USERNAME_3!,
//           credential: process.env.NEXT_PUBLIC_TWILIO_TURN_CREDENTIAL_3!,
//         },
//       ];

//       // Initially, only use STUN servers
//       let retryAttempted = false;

//       // Function to build a new peer instance with a given ICE configuration
//       const buildPeer = (iceServers: RTCIceServer[]): Peer.Instance => {
//         const newPeer = new Peer({
//           stream,
//           initiator,
//           trickle: true,
//           config: { iceServers },
//         });

//         // Handle receiving remote stream
//         newPeer.on("stream", (remoteStream) => {
//           console.log("Remote stream received", remoteStream);
//           const updatedPeerData: PeerData = {
//             peerConnection: newPeer,
//             participantUser: null, // Set externally as needed
//             stream: remoteStream,
//           };
//           dispatch(setPeer(updatedPeerData));
//         });

//         // Listen for ICE connection state changes
//         newPeer.on("iceConnectionStateChange", () => {
//           const iceState = (newPeer as any).iceConnectionState;
//           console.log("ICE connection state changed to:", iceState);
//           if (iceState === "failed" && !retryAttempted) {
//             retryAttempted = true;
//             console.warn(
//               "ICE connection failed. Retrying with TURN servers..."
//             );
//             newPeer.destroy();
//             const fallbackPeer = buildPeer([...stunServers, ...turnServers]);
//             peerRef.current = fallbackPeer;
//           }
//         });

//         // Handle errors in the peer connection
//         newPeer.on("error", (err) => {
//           console.error("Peer connection error:", err);
//           if (!retryAttempted) {
//             retryAttempted = true;
//             console.warn(
//               "Error encountered. Retrying peer connection with TURN servers..."
//             );
//             newPeer.destroy();
//             const fallbackPeer = buildPeer([...stunServers, ...turnServers]);
//             peerRef.current = fallbackPeer;
//           }
//         });

//         return newPeer;
//       };

//       // Create the initial peer with STUN servers only
//       const peer = buildPeer(stunServers);
//       peerRef.current = peer;
//       return peer;
//     },
//     [dispatch]
//   );

//   // Function to safely destroy the current peer instance
//   const destroyPeer = useCallback(() => {
//     if (peerRef.current) {
//       peerRef.current.destroy();
//       peerRef.current = null;
//     }
//   }, []);

//   return { createPeer, destroyPeer };
// };
