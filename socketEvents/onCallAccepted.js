import { io } from "../server.js";

const onCallAccepted = (data) => {
    // Notify the caller that the call was accepted
    if (data.participants.caller.socketId) {
        io.to(data.participants.caller.socketId).emit("callAccepted", data);
    } else {
        console.log("Caller socketId not found");
    }
};

export default onCallAccepted;