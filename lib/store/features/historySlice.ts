//historySlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [{ id: 1, sender: "model", message: "What do you want to build?" }],
};

export const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    addChatHistoryEntry: (state, action) => {
      state.value.push(action.payload);
    },
    clearChatHistory: () => initialState,
  },
});

export const { addChatHistoryEntry, clearChatHistory } =
  chatHistorySlice.actions;

export default chatHistorySlice.reducer;
