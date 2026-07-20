import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://travix-ai-backend.vercel.app",
  plugins: [
    jwtClient()
  ]
});

export const { useSession, signIn, signUp, signOut } = authClient;
