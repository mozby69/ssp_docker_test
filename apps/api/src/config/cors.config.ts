import { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = [
    env.FRONTEND_URL,
    env.FRONTEND_LAN_URL,
    env.SSH_TESTING,
].filter(Boolean);

export const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // Allow requests from tools like Postman
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
};