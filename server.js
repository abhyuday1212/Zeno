import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socketEvents/socketEvents.js"
import onWebrtcSignal from "./socketEvents/onWebrtcSignal.js"
import onCallAccepted from "./socketEvents/onCallAccepted.js";
import onHangup from "./socketEvents/onHangup.js";
import onCallCancelled from "./socketEvents/onCallCancelled.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

let updateInProgress = false;

app.prepare().then(() => {
    const httpServer = createServer(handler);

    io = new Server(httpServer);
    let onlineUsers = [];

    io.on("connection", (socket) => {
        console.log("Client Connected...")

        // Add User
        socket.on('addNewUser', (nextAuthUser) => {
            if (!nextAuthUser) return;

            const existingUserIndex = onlineUsers.findIndex(user => user.userId === nextAuthUser.id);

            if (existingUserIndex !== -1) {
                // User exists, update their socket ID but preserve visibility status
                const currentVisibility = onlineUsers[existingUserIndex].isInvisible;
                onlineUsers[existingUserIndex] = {
                    userId: nextAuthUser.id,
                    socketId: socket.id,
                    profile: nextAuthUser,
                    isInvisible: currentVisibility
                };
            } else {
                // New user, add them
                onlineUsers.push({
                    userId: nextAuthUser.id,
                    socketId: socket.id,
                    profile: nextAuthUser,
                    isInvisible: false // default to visible
                });
            }

            // send active users
            io.emit('getUsers', onlineUsers);
        })

        // Add this new event handler
        socket.on('setUserInvisible', (userId) => {
            console.log(`Setting user ${userId} to invisible`);
            if (updateInProgress) {
                setTimeout(() => {
                    socket.emit('retryVisibilityUpdate', { userId, makeInvisible: true });
                }, 200);
                return;
            }

            updateInProgress = true;

            // Find the user in online users list
            const userIndex = onlineUsers.findIndex(user => user.userId === userId);

            if (userIndex !== -1) {
                // Update user's visibility status without removing them
                onlineUsers[userIndex].isInvisible = true;

                // First send confirmation to the specific client to ensure immediate UI update
                io.emit('getUsers', onlineUsers);

                // Send confirmation to the specific client
                socket.emit('visibilityUpdated', {
                    userId,
                    isInvisible: true
                });

                // Release the lock after a short delay
                setTimeout(() => {
                    updateInProgress = false;
                }, 100);
            } else {
                updateInProgress = false;
            }
        });

        socket.on('setUserVisible', (userId) => {
            console.log(`Setting user ${userId} to visible`);

            // Find the user in online users list
            const userIndex = onlineUsers.findIndex(user => user.userId === userId);

            if (userIndex !== -1) {
                // Update user's visibility status
                onlineUsers[userIndex].isInvisible = false;

                // First send confirmation to the specific client
                socket.emit('visibilityUpdated', {
                    userId,
                    isInvisible: false
                });

                // Then send updated user list with a slight delay
                setTimeout(() => {
                    io.emit('getUsers', onlineUsers);
                }, 50);
            }
        });

        socket.on('retryVisibilityUpdate', (data) => {
            if (data.makeInvisible) {
                socket.emit('setUserInvisible', data.userId);
            } else {
                socket.emit('setUserVisible', data.userId);
            }
        });


        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

            //send active users
            io.emit('getUsers', onlineUsers)
        })

        // call events
        socket.on('call', onCall);
        socket.on('webrtcSignal', onWebrtcSignal)
        socket.on("callAccepted", onCallAccepted); // when receiver accepts the call
        socket.on("callCancelled", onCallCancelled);
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