import { io } from "../server.js";

const onCallCancelled = (participants) => {
    if (participants && participants.receiver) {
        // Forward the cancellation to the receiver
        io.to(participants.receiver.socketId).emit("callCancelled", participants);
    }
};

export default onCallCancelled;