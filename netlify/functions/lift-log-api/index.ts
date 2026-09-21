import type { Config } from "@netlify/functions";
import { createApiHandler } from "./api";
import { mongoAuth } from "./auth";
import { getMongoRepository } from "./mongoRepository";

const configuredOrigins = (process.env.FRONTEND_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const handler = createApiHandler({
  getRepository: getMongoRepository,
  auth: mongoAuth,
  allowedOrigins: configuredOrigins,
});

export default async (request: Request): Promise<Response> => handler(request);

export const config: Config = {
  path: ["/api/*", "/swagger", "/swagger/*"],
  rateLimit: {
    windowLimit: 60,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
