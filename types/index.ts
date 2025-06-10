import Peer from "simple-peer";
import { User } from "next-auth";

export type SocketUser = {
  userId: string;
  socketId: string;
  profile: User;
  isInvisible: boolean;
};

export interface Participants {
  caller: SocketUser | null;
  receiver: SocketUser | null;
  roomId?: string;
}

export interface OngoingCall {
  participants: Participants | null;
  isRinging: boolean;
  roomId?: string;
}

export interface PeerData {
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
  participantUser: SocketUser;
}
