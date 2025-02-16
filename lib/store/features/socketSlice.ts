import { SocketUser } from "./../../../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OngoingCall, Participants } from "../../../types";
import { Socket as ClientSocket } from "socket.io-client";
import { set } from "zod";

interface SafeSocketState {
  id: string | null;
  connected: boolean;
}

const initialState = {
  isConnected: false,
  socket: null,
  onlineUsers: [] as SocketUser[],
  ongoingCall: {} as OngoingCall,
  localStream: null as MediaStream | null,
  isMicOn: true,
  isCameraOn: true,
};

export const socketSlice = createSlice({
  name: "socketContext",
  initialState,

  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    onConnect: (state) => {
      state.isConnected = true;
    },

    onDisconnect: (state) => {
      state.isConnected = false;
      state.socket = null;
    },

    updateOnlineUsers: (state, action: PayloadAction<SocketUser[]>) => {
      state.onlineUsers = action.payload;
    },

    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },

    setMic: (state, action) => {
      state.isMicOn = action.payload;
    },

    setCamera: (state, action) => {
      state.isCameraOn = action.payload;
    },
  },
});

export const {
  setSocket,
  onConnect,
  onDisconnect,
  updateOnlineUsers,
  setLocalStream,
  setMic,
  setCamera,
} = socketSlice.actions;

export default socketSlice.reducer;
