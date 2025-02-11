import { SocketUser } from "./../../../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OngoingCall, Participants } from "../../../types";
import { Socket as ClientSocket } from "socket.io-client";

interface SafeSocketState {
  id: string | null;
  connected: boolean;
}

const initialState = {
  isConnected: false,
  socket: null,
  onlineUsers: [] as SocketUser[],
  ongoingCall: {} as OngoingCall,
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
  },
});

export const { setSocket, onConnect, onDisconnect, updateOnlineUsers } =
  socketSlice.actions;

export default socketSlice.reducer;
