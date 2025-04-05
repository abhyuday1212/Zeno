import { io } from "../server.js";

const onHangup = async (data) => {
    console.log("Inside onHangup...", data);

    // Declare the variable before using it
    let socketIdToEmitTo;

    // Notify the caller that the call was accepted
    if (data.ongoingCall.participants.caller.userId === data.userHangingUpId) {
        socketIdToEmitTo = data.ongoingCall.participants.receiver.socketId;
        console.log("🚀 -> onHangup.js:12 -> onHangup -> socketIdToEmitTo:", socketIdToEmitTo);

    } else {
        socketIdToEmitTo = data.ongoingCall.participants.caller.socketId;
    }

    if (socketIdToEmitTo) {
        io.to(socketIdToEmitTo).emit("hangup");
    }
};

export default onHangup;