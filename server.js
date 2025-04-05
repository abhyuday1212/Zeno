import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socketEvents/socketEvents.js"
import onWebrtcSignal from "./socketEvents/onWebrtcSignal.js"
import onCallAccepted from "./socketEvents/onCallAccepted.js";
import onHangup from "./socketEvents/onHangup.js";




const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
    const httpServer = createServer(handler);

    io = new Server(httpServer);
    let onlineUsers = [];

    io.on("connection", (socket) => {
        console.log("Client Connected...")

        // Add User
        socket.on('addNewUser', (nextAuthUser) => {
            nextAuthUser && !onlineUsers.some(user => user?.userId === nextAuthUser.id) && onlineUsers.push({
                userId: nextAuthUser.id,
                socketId: socket.id,
                profile: nextAuthUser
            })

            // send active users
            io.emit('getUsers', onlineUsers);
        })


        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

            //send active users
            io.emit('getUsers', onlineUsers)
        })

        // call events
        socket.on('call', onCall);
        socket.on('webrtcSignal', onWebrtcSignal)
        socket.on("callAccepted", onCallAccepted);
        socket.on("hangup", onHangup);

    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});