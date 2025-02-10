import { SocketUser } from "./../../../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false, // Track socket connection status
  socket: null, // Store socket instance
  onlineUsers: [] as SocketUser[], // Store online users in a array for SocketUser type
};

export const socketSlice = createSlice({
  name: "socketContext",
  initialState,

  reducers: {
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload;
    },
    onConnect: (state) => {
      state.isConnected = true;
    },
    onDisconnect: (state) => {
      state.isConnected = false;
      state.socket = null; // Reset socket instance on disconnect
    },

    updateOnlineUsers: (state, action: PayloadAction<SocketUser[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setSocket, onConnect, onDisconnect, updateOnlineUsers } =
  socketSlice.actions;

export default socketSlice.reducer;
