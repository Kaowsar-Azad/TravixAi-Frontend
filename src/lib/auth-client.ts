import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  plugins: [
    jwtClient()
  ]
});

export const { useSession, signIn, signUp, signOut } = authClient;
