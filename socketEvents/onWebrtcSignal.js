import { io } from "../server.js"

// this is the data that we are receiving from the client

// {
//     sdp: data,
//         ongoingCall,
//         isCaller: false,
// }


// We are emitting webrtcsignal to the other user
const onWebrtcSignal = async (data) => {
    if (data.isCaller) {
        if (data.ongoingCall.participants.receiver.socketId) {
            io.to(data.ongoingCall.participants.receiver.socketId).emit("webrtcSignal", data)
        }
    }
    else {
        if (data.ongoingCall.participants.caller.socketId) {
            io.to(data.ongoingCall.participants.caller.socketId).emit("webrtcSignal", data)
        }
    }
    console.log("Signal from:", data);
    console.log("Caller socketId:", data.ongoingCall.participants.caller.socketId);
    console.log("Receiver socketId:", data.ongoingCall.participants.receiver.socketId);
}

export default onWebrtcSignal;