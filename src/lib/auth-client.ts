import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL || "https://travix-ai-backend.vercel.app")
  : window.location.origin + "/api/auth";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    jwtClient()
  ]
});

export const { useSession, signIn, signUp, signOut } = authClient;
