import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoConnection } from "./mongoRepository";
import type { AuthDependencies, AuthSession } from "./types";

/**
 * The master admin is designated by environment, never by a database flag, so
 * there is no privileged row to seed, leak or accidentally hand out.
 */
export const adminEmails = (): ReadonlyArray<string> =>
  (process.env.SUPERUSER_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email: string | null | undefined): boolean =>
  !!email && adminEmails().includes(email.trim().toLowerCase());

const trustedOrigins = (): string[] =>
  (process.env.FRONTEND_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const createAuth = async () => {
  const { client, database } = await getMongoConnection();

  return betterAuth({
    appName: "lift-log",
    // Falls back to BETTER_AUTH_URL when omitted; set explicitly for clarity.
    baseURL: process.env.BETTER_AUTH_URL,
    // Falls back to BETTER_AUTH_SECRET; Better Auth throws in production if unset.
    secret: process.env.BETTER_AUTH_SECRET,
    // Matches the path the Netlify function already claims.
    basePath: "/api/auth",
    database: mongodbAdapter(database, { client }),
    // Google only. Credentials are read at request time, so a missing value
    // surfaces as a sign-in error rather than a cold-start crash.
    emailAndPassword: { enabled: false },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    trustedOrigins: trustedOrigins(),
  });
};

// Inferred rather than annotated: Better Auth's Auth type is generic over the
// exact options object, so a widened annotation does not match.
type Auth = Awaited<ReturnType<typeof createAuth>>;

let authPromise: Promise<Auth> | undefined;

const getAuth = (): Promise<Auth> => {
  if (!authPromise) {
    authPromise = createAuth().catch((error) => {
      authPromise = undefined;
      throw error;
    });
  }

  return authPromise;
};

export const mongoAuth: AuthDependencies = {
  async handleAuthRequest(request: Request): Promise<Response> {
    const auth = await getAuth();
    return auth.handler(request);
  },

  async getSession(request: Request): Promise<AuthSession | null> {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      isAdmin: isAdminEmail(session.user.email),
    };
  },
};
