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

    resetCallState: (state) => {
      state.ongoingCall = initialState.ongoingCall;
      state.participants = initialState.participants;
      state.isCallEnded = initialState.isCallEnded;
    },
  },
});

export const {
  setParticipants,
  setOngoingCall,
  resetCallState,
  setIsCallEnded,
} = callSlice.actions;

export default callSlice.reducer;
