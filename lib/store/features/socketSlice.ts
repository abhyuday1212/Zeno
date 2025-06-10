import { PeerData, SocketUser } from "./../../../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OngoingCall } from "../../../types";

const initialState = {
  isConnected: false,
  socket: null,
  onlineUsers: [] as SocketUser[],
  ongoingCall: {} as OngoingCall,
  localStream: null as MediaStream | null,
  isMicOn: true,
  isCameraOn: true,
  peer: null as PeerData | null,
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

    updateUserVisibility: (
      state,
      action: PayloadAction<{ userId: string; isInvisible: boolean }>
    ) => {
      state.onlineUsers = state.onlineUsers.map((user) =>
        user.userId === action.payload.userId
          ? { ...user, isInvisible: action.payload.isInvisible }
          : user
      );
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

    setPeer: (state, action) => {
      state.peer = action.payload;
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
  setPeer,
  updateUserVisibility,
} = socketSlice.actions;

export default socketSlice.reducer;
