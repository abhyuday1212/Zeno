import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socketEvents/socketEvents.js"
import onWebrtcSignal from "./socketEvents/onWebrtcSignal.js"
import onCallAccepted from "./socketEvents/onCallAccepted.js";
import onHangup from "./socketEvents/onHangup.js";
import onCallCancelled from "./socketEvents/onCallCancelled.js";
import morgan from "morgan";
import express from "express";
import logger from "./utils/logger.js"
import * as dotenv from 'dotenv';


dotenv.config({ path: '.env' });

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

export let io;

nextApp.prepare().then(() => {
    const expressApp = express();

    const morganFormat = ":method :url :status - :response-time ms";

    expressApp.use(
        morgan(morganFormat, {
            stream: {
                write: (message) => {
                    const logObject = {
                        method: message.split(" ")[0],
                        url: message.split(" ")[1],
                        status: message.split(" ")[2],
                        responseTime: message.split(" ")[3],
                    };
                    logger.info(JSON.stringify(logObject));
                },
            },
        })
    );

    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));

    expressApp.use('/', (req, res) => {
        return nextHandler(req, res);
    });

    const httpServer = createServer(expressApp);

    io = new Server(httpServer);
    let onlineUsers = [];

    io.on("connection", (socket) => {
        console.log("Client Connected...")

        socket.on('addNewUser', (nextAuthUser) => {
            nextAuthUser && !onlineUsers.some(user => user?.userId === nextAuthUser.id) && onlineUsers.push({
                userId: nextAuthUser.id,
                socketId: socket.id,
                profile: nextAuthUser
            })

            io.emit('getUsers', onlineUsers);
        })

        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

            io.emit('getUsers', onlineUsers)
        })

        socket.on('call', onCall);
        socket.on('webrtcSignal', onWebrtcSignal)
        socket.on("callAccepted", onCallAccepted);
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