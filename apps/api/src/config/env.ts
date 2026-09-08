import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),

    DATABASE_URL: z.string(),

    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().default("1d"),

    FRONTEND_URL: z.string().url(),
    FRONTEND_LAN_URL: z.string().url(),
    SSH_TESTING: z.string().url(),

    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
});

export const env = envSchema.parse(process.env);