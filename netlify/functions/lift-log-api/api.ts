import { openApiDocument, swaggerHtml } from "./openapi";
import { DuplicateLogError, type LiftLogRepository } from "./types";
import {
  createLiftLogSchema,
  liftLogEntrySchema,
  toValidationIssues,
  type ValidationIssue,
} from "./validation";

type Logger = {
  error(message: string, error?: unknown): void;
};

export type ApiDependencies = {
  getRepository(): Promise<LiftLogRepository>;
  allowedOrigins?: ReadonlyArray<string>;
  logger?: Logger;
};

const jsonResponse = (value: unknown, status = 200): Response =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const emptyResponse = (status: number, headers?: HeadersInit): Response =>
  new Response(null, { status, headers });

const problemResponse = (
  status: number,
  title: string,
  errors?: ValidationIssue[],
): Response =>
  new Response(
    JSON.stringify({ title, status, ...(errors ? { errors } : {}) }),
    {
      status,
      headers: { "content-type": "application/problem+json; charset=utf-8" },
    },
  );

const methodNotAllowed = (allow: string): Response =>
  emptyResponse(405, { allow });

const addVaryHeader = (headers: Headers, value: string): void => {
  const existingValues = (headers.get("vary") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (
    !existingValues.some((item) => item.toLowerCase() === value.toLowerCase())
  ) {
    headers.set("vary", [...existingValues, value].join(", "));
  }
};

const isAllowedOrigin = (
  request: Request,
  allowedOrigins: ReadonlyArray<string>,
): boolean => {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  return (
    origin === new URL(request.url).origin || allowedOrigins.includes(origin)
  );
};

const finalizeResponse = (
  request: Request,
  response: Response,
  allowedOrigins: ReadonlyArray<string>,
): Response => {
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");

  const origin = request.headers.get("origin");
  if (origin) {
    addVaryHeader(headers, "Origin");
    if (isAllowedOrigin(request, allowedOrigins)) {
      headers.set("access-control-allow-origin", origin);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const parseJson = async (request: Request): Promise<unknown> => {
  const body = await request.text();
  if (!body) {
    throw new SyntaxError("The request body is empty");
  }
  return JSON.parse(body) as unknown;
};

const decodeLogName = (encodedLogName: string): string | null => {
  try {
    return decodeURIComponent(encodedLogName).toLowerCase();
  } catch {
    return null;
  }
};

const normalizedPath = (request: Request): string => {
  const pathname = new URL(request.url).pathname;
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
};

export const createApiHandler = (dependencies: ApiDependencies) => {
  const allowedOrigins = dependencies.allowedOrigins ?? [];
  const logger = dependencies.logger ?? console;

  return async (request: Request): Promise<Response> => {
    const finish = (response: Response): Response =>
      finalizeResponse(request, response, allowedOrigins);

    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin(request, allowedOrigins)) {
        return finish(emptyResponse(403));
      }

      const requestedHeaders = request.headers.get(
        "access-control-request-headers",
      );
      const headers = new Headers({
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-max-age": "600",
      });
      if (requestedHeaders) {
        headers.set("access-control-allow-headers", requestedHeaders);
      }
      return finish(emptyResponse(204, headers));
    }

    const path = normalizedPath(request);

    try {
      if (/^\/swagger(?:\/index\.html)?$/i.test(path)) {
        if (request.method !== "GET") {
          return finish(methodNotAllowed("GET, OPTIONS"));
        }
        return finish(
          new Response(swaggerHtml, {
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
        );
      }

      if (/^\/swagger\/v1\/swagger\.json$/i.test(path)) {
        if (request.method !== "GET") {
          return finish(methodNotAllowed("GET, OPTIONS"));
        }
        return finish(jsonResponse(openApiDocument));
      }

      if (/^\/api\/healthcheck$/i.test(path)) {
        if (request.method !== "GET") {
          return finish(methodNotAllowed("GET, OPTIONS"));
        }

        try {
          const repository = await dependencies.getRepository();
          await repository.ping();
          return finish(emptyResponse(200));
        } catch (error) {
          logger.error("Lift Log database health check failed", error);
          return finish(emptyResponse(503));
        }
      }

      if (/^\/api\/liftlogs$/i.test(path)) {
        if (request.method === "GET") {
          const repository = await dependencies.getRepository();
          return finish(jsonResponse(await repository.getAllLogs()));
        }

        if (request.method === "POST") {
          let body: unknown;
          try {
            body = await parseJson(request);
          } catch {
            return finish(problemResponse(400, "Invalid JSON request body"));
          }

          const result = createLiftLogSchema.safeParse(body);
          if (!result.success) {
            return finish(
              problemResponse(
                400,
                "Validation failed",
                toValidationIssues(result.error.issues),
              ),
            );
          }

          const name = result.data.name.toLowerCase();
          try {
            const repository = await dependencies.getRepository();
            await repository.createLog({ ...result.data, name });
            return finish(emptyResponse(201));
          } catch (error) {
            if (error instanceof DuplicateLogError) {
              return finish(
                new Response(error.message, {
                  status: 400,
                  headers: { "content-type": "text/plain; charset=utf-8" },
                }),
              );
            }
            throw error;
          }
        }

        return finish(methodNotAllowed("GET, POST, OPTIONS"));
      }

      const addEntryMatch = path.match(/^\/api\/liftlogs\/([^/]+)\/lifts$/i);
      if (addEntryMatch) {
        if (request.method !== "POST") {
          return finish(methodNotAllowed("POST, OPTIONS"));
        }

        const logName = decodeLogName(addEntryMatch[1]);
        if (logName === null) {
          return finish(problemResponse(400, "Invalid log name"));
        }

        let body: unknown;
        try {
          body = await parseJson(request);
        } catch {
          return finish(problemResponse(400, "Invalid JSON request body"));
        }

        const result = liftLogEntrySchema.safeParse(body);
        if (!result.success) {
          return finish(
            problemResponse(
              400,
              "Validation failed",
              toValidationIssues(result.error.issues),
            ),
          );
        }

        const repository = await dependencies.getRepository();
        const wasAdded = await repository.addEntry(logName, result.data);
        return finish(emptyResponse(wasAdded ? 201 : 404));
      }

      const getLogMatch = path.match(/^\/api\/liftlogs\/([^/]+)$/i);
      if (getLogMatch) {
        if (request.method !== "GET") {
          return finish(methodNotAllowed("GET, OPTIONS"));
        }

        const logName = decodeLogName(getLogMatch[1]);
        if (logName === null) {
          return finish(problemResponse(400, "Invalid log name"));
        }

        const repository = await dependencies.getRepository();
        const log = await repository.getLog(logName);
        return finish(log ? jsonResponse(log) : emptyResponse(404));
      }

      return finish(emptyResponse(404));
    } catch (error) {
      logger.error("Lift Log API request failed", error);
      return finish(problemResponse(500, "Internal Server Error"));
    }
  };
};
