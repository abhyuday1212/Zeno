import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OngoingCall, Participants } from "../../../types";

const initialState = {
  ongoingCall: {
    participants: null,
    isRinging: false,
  } as OngoingCall,

  participants: {
    caller: null,
    receiver: null,
  } as Participants,

  isCallEnded: false,
  isCallActive: false,
  roomId: null,
};

export const callSlice = createSlice({
  name: "callContext",
  initialState,
  reducers: {
    setParticipants: (state, action: PayloadAction<Participants>) => {
      state.participants = action.payload;
    },

    setOngoingCall: (state, action: PayloadAction<OngoingCall>) => {
      state.ongoingCall = action.payload;
    },

    setIsCallEnded: (state, action: PayloadAction<boolean>) => {
      state.isCallEnded = action.payload;
    },

    setIsCallActive: (state, action: PayloadAction<boolean>) => {
      state.isCallActive = action.payload;
    },

    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },

    resetCallState: (state) => {
      state.ongoingCall = initialState.ongoingCall;
      state.participants = initialState.participants;
      state.isCallEnded = initialState.isCallEnded;
      state.isCallActive = initialState.isCallActive;
      state.roomId = initialState.roomId;
    },
  },
});

export const {
  setParticipants,
  setOngoingCall,
  resetCallState,
  setIsCallEnded,
  setIsCallActive,
  setRoomId,
} = callSlice.actions;

export default callSlice.reducer;
