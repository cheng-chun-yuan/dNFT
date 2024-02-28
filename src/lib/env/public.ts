import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_CLIENT_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_ID: z.string().optional(),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_BASE_URL:
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "1",
  NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID || "1",
  NEXT_PUBLIC_CLIENT_KEY: process.env.NEXT_PUBLIC_CLIENT_KEY || "1",
  NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID || "1",
};

publicEnvSchema.parse(publicEnv);
