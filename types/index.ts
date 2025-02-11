import { User } from "next-auth";

export type SocketUser = {
  userId: string;
  socketId: string;
  profile: User;
};

export interface Participants {
  caller: SocketUser | null;
  receiver: SocketUser | null;
}

export interface OngoingCall {
  participants: Participants | null;
  isRinging: boolean;
}