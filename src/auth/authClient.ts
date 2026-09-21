import { createAuthClient } from "better-auth/react";

// The Netlify function serves Better Auth under the same prefix as the rest of
// the API, so derive the client's URL from the one base the app is configured
// with rather than hard-coding /api/auth twice.
const apiBaseUrl = import.meta.env.REACT_APP_API_BASE_URL || "/api";
const authUrl = new URL(`${apiBaseUrl}/auth`, window.location.origin);

export const authClient = createAuthClient({
  baseURL: authUrl.origin,
  basePath: authUrl.pathname
});

export const { signIn, signOut, useSession } = authClient;

export const signInWithGoogle = () =>
  signIn.social({
    provider: "google",
    // Come back to whichever board or list the visitor was trying to reach.
    callbackURL: `${window.location.pathname}${window.location.search}`
  });
