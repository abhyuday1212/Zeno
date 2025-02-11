import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OngoingCall, Participants, SocketUser } from "../../../types";

const initialState = {
  ongoingCall: {
    participants: null,
    isRinging: false,
  } as OngoingCall,

  participants: {
    caller: null,
    receiver: null,
  } as Participants,
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
    resetCallState: (state) => {
      state.ongoingCall = initialState.ongoingCall;
      state.participants = initialState.participants;
    },
  },
});

export const { setParticipants, setOngoingCall, resetCallState } =
  callSlice.actions;
export default callSlice.reducer;
