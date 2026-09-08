import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { env } from "./env";
import { registerSocketHandlers } from "@/socket";

const allowedOrigins = [
    env.FRONTEND_URL,
    env.FRONTEND_LAN_URL,
    env.SSH_TESTING,
];

export function initializeSocket(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    registerSocketHandlers(io);

    return io;
}