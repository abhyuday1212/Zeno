import { io } from "../server.js";

const onCallAccepted = (data) => {
    // Ensure data has all the necessary properties
    if (!data.participants || !data.participants.caller || !data.participants.caller.socketId) {
        console.error("Invalid call accepted data:", data);
        return;
    }

    // Create the call data object with room ID
    const callData = {
        participants: data.participants,
        isRinging: false,
        roomId: data.roomId
    };

    // Notify the caller that the call was accepted
    io.to(data.participants.caller.socketId).emit("callAccepted", callData);

    console.log("Call accepted, notifying caller with room ID:", data.roomId);
};

export default onCallAccepted;