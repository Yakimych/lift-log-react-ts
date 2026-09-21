// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApiHandler } from "./api";
import { config } from "./index";
import {
  DuplicateLogError,
  type ApiLiftLog,
  type ApiLiftLogEntry,
  type AuthSession,
  type CreateLiftLog,
  type LiftLogRepository,
  type UpdateLiftLog,
} from "./types";

const baseUrl = "https://lift-log.example";

const sampleEntry = {
  name: "Arnold",
  weightLifted: 100,
  date: "2026-07-11T12:00:00.000Z",
  sets: [{ numberOfReps: 5, rpe: 8.5 }],
  comment: "Strong set",
  links: [{ text: "Video", url: "https://example.com/lift" }],
};

const sampleLog = {
  name: "squats",
  title: "Squats",
  entries: [{ id: 0, ...sampleEntry }],
};

const makeRequest = (path: string, init?: RequestInit): Request =>
  new Request(`${baseUrl}${path}`, init);

const jsonRequest = (
  path: string,
  body: unknown,
  method = "POST",
): Request =>
  makeRequest(path, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const createRepository = () => ({
  createLog: vi.fn(async (log: CreateLiftLog) => {
    void log;
  }),
  getAllLogs: vi.fn(async (): Promise<ApiLiftLog[]> => [sampleLog]),
  getLog: vi.fn(async (logName: string): Promise<ApiLiftLog | null> => {
    void logName;
    return sampleLog;
  }),
  updateLog: vi.fn(async (logName: string, log: UpdateLiftLog) => {
    void logName;
    void log;
    return true;
  }),
  deleteLog: vi.fn(async (logName: string) => {
    void logName;
    return true;
  }),
  addEntry: vi.fn(
    async (logName: string, entry: ApiLiftLogEntry): Promise<boolean> => {
      void logName;
      void entry;
      return true;
    },
  ),
  updateEntry: vi.fn(
    async (
      logName: string,
      entryId: number,
      entry: ApiLiftLogEntry,
    ): Promise<boolean> => {
      void logName;
      void entryId;
      void entry;
      return true;
    },
  ),
  deleteEntry: vi.fn(
    async (logName: string, entryId: number): Promise<boolean> => {
      void logName;
      void entryId;
      return true;
    },
  ),
  ping: vi.fn(async () => undefined),
});

const adminSession: AuthSession = {
  userId: "admin-1",
  email: "admin@example.com",
  name: "Admin",
  isAdmin: true,
};

const memberSession: AuthSession = {
  userId: "member-1",
  email: "member@example.com",
  name: "Member",
  isAdmin: false,
};

const createAuth = (session: AuthSession | null = adminSession) => ({
  handleAuthRequest: vi.fn(
    async (request: Request) =>
      new Response(JSON.stringify({ ok: true, path: new URL(request.url).pathname }), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "set-cookie": "better-auth.session_token=abc; Path=/; HttpOnly",
        },
      }),
  ),
  getSession: vi.fn(async (request: Request) => {
    void request;
    return session;
  }),
});

describe("Netlify function configuration", () => {
  it("routes API and Swagger through one per-domain/IP rate-limited function", () => {
    expect(config.path).toEqual(["/api/*", "/swagger", "/swagger/*"]);
    expect(config.rateLimit).toEqual({
      windowLimit: 60,
      windowSize: 60,
      aggregateBy: ["ip", "domain"],
    });
  });
});

describe("Lift Log API handler", () => {
  let repository: ReturnType<typeof createRepository>;
  let logger: { error: ReturnType<typeof vi.fn> };
  let getRepository: ReturnType<typeof vi.fn>;
  let auth: ReturnType<typeof createAuth>;
  let handle: ReturnType<typeof createApiHandler>;

  beforeEach(() => {
    repository = createRepository();
    logger = { error: vi.fn() };
    getRepository = vi.fn(async () => repository as LiftLogRepository);
    auth = createAuth();
    handle = createApiHandler({ getRepository, auth, logger });
  });

  it("returns all logs with the legacy aggregate shape and no-store", async () => {
    const response = await handle(makeRequest("/API/lIfTlOgS"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual([sampleLog]);
  });

  it("normalizes a case-insensitive log name lookup", async () => {
    const response = await handle(makeRequest("/api/LiftLogs/SqUaTs"));

    expect(response.status).toBe(200);
    expect(repository.getLog).toHaveBeenCalledWith("squats");
    expect(await response.json()).toEqual(sampleLog);
  });

  it("returns an empty 404 when a log does not exist", async () => {
    repository.getLog.mockResolvedValueOnce(null);

    const response = await handle(makeRequest("/api/LiftLogs/missing"));

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  });

  it("creates a normalized log, ignores unknown properties, and returns an empty 201", async () => {
    const response = await handle(
      jsonRequest("/api/LiftLogs", {
        title: "Bench Press",
        name: "BenchPress",
        entries: [{ ignored: true }],
      }),
    );

    expect(response.status).toBe(201);
    expect(await response.text()).toBe("");
    expect(repository.createLog).toHaveBeenCalledWith({
      title: "Bench Press",
      name: "benchpress",
    });
  });

  it("preserves the duplicate-log error contract without leaking driver errors", async () => {
    repository.createLog.mockRejectedValueOnce(
      new DuplicateLogError("benchpress"),
    );

    const response = await handle(
      jsonRequest("/api/LiftLogs", {
        title: "Bench Press",
        name: "BENCHPRESS",
      }),
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(await response.text()).toBe(
      "Lift Log with name 'benchpress' already exists",
    );
  });

  it("rejects malformed JSON before opening a database connection", async () => {
    const response = await handle(
      makeRequest("/api/LiftLogs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    expect(getRepository).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({
      title: "Invalid JSON request body",
      status: 400,
    });
  });

  it("validates create-log length limits", async () => {
    const response = await handle(
      jsonRequest("/api/LiftLogs", { title: "x".repeat(51), name: "x" }),
    );

    expect(response.status).toBe(400);
    expect(getRepository).not.toHaveBeenCalled();
    const problem = (await response.json()) as { errors: unknown[] };
    expect(problem.errors).toHaveLength(2);
  });

  it("accepts exact create-log length boundaries", async () => {
    const response = await handle(
      jsonRequest("/api/LiftLogs", {
        title: "t".repeat(50),
        name: "n".repeat(20),
      }),
    );

    expect(response.status).toBe(201);
    expect(repository.createLog).toHaveBeenCalledWith({
      title: "t".repeat(50),
      name: "n".repeat(20),
    });
  });

  it("adds one entry with normalized date/nulls and an empty 201", async () => {
    const response = await handle(
      jsonRequest("/API/LiftLogs/SqUaTs/LiFtS", {
        ...sampleEntry,
        date: "2026-07-11T14:00:00+02:00",
        sets: [],
        comment: undefined,
        links: undefined,
        ignored: "value",
      }),
    );

    expect(response.status).toBe(201);
    expect(await response.text()).toBe("");
    expect(repository.addEntry).toHaveBeenCalledWith("squats", {
      name: sampleEntry.name,
      weightLifted: sampleEntry.weightLifted,
      date: "2026-07-11T12:00:00.000Z",
      sets: [],
      comment: null,
      links: null,
    });
  });

  it("returns an empty 404 when adding to a missing log", async () => {
    repository.addEntry.mockResolvedValueOnce(false);

    const response = await handle(
      jsonRequest("/api/LiftLogs/missing/Lifts", sampleEntry),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  });

  it.each([
    ["weight below range", { ...sampleEntry, weightLifted: -1 }],
    ["weight above range", { ...sampleEntry, weightLifted: 1000 }],
    ["invalid date", { ...sampleEntry, date: "not-a-date" }],
    [
      "reps below range",
      { ...sampleEntry, sets: [{ numberOfReps: 0, rpe: null }] },
    ],
    [
      "reps above range",
      { ...sampleEntry, sets: [{ numberOfReps: 1000, rpe: null }] },
    ],
    [
      "invalid RPE increment",
      { ...sampleEntry, sets: [{ numberOfReps: 5, rpe: 8.2 }] },
    ],
    ["participant name too long", { ...sampleEntry, name: "x".repeat(31) }],
    ["comment too long", { ...sampleEntry, comment: "x".repeat(401) }],
    [
      "link text too long",
      {
        ...sampleEntry,
        links: [{ text: "x".repeat(21), url: "x" }],
      },
    ],
    [
      "link URL too long",
      {
        ...sampleEntry,
        links: [{ text: "x", url: "x".repeat(201) }],
      },
    ],
    [
      "too many links",
      {
        ...sampleEntry,
        links: Array.from({ length: 4 }, () => ({ text: "x", url: "x" })),
      },
    ],
  ])("rejects %s", async (_description, entry) => {
    const response = await handle(
      jsonRequest("/api/LiftLogs/squats/Lifts", entry),
    );

    expect(response.status).toBe(400);
    expect(repository.addEntry).not.toHaveBeenCalled();
  });

  it("accepts exact entry field boundaries", async () => {
    const boundaryEntry = {
      name: "n".repeat(30),
      weightLifted: 999,
      date: "2026-07-11T12:00:00.000Z",
      sets: [
        { numberOfReps: 1, rpe: 6.5 },
        { numberOfReps: 999, rpe: 10 },
      ],
      comment: "c".repeat(400),
      links: Array.from({ length: 3 }, () => ({
        text: "t".repeat(20),
        url: "u".repeat(200),
      })),
    };

    const response = await handle(
      jsonRequest("/api/LiftLogs/squats/Lifts", boundaryEntry),
    );

    expect(response.status).toBe(201);
    expect(repository.addEntry).toHaveBeenCalledWith("squats", boundaryEntry);
  });

  it("accepts all legacy RPE values and nullable legacy fields", async () => {
    for (const rpe of [null, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]) {
      const response = await handle(
        jsonRequest("/api/LiftLogs/squats/Lifts", {
          ...sampleEntry,
          sets: [{ numberOfReps: 1, rpe }],
          comment: null,
          links: null,
        }),
      );
      expect(response.status).toBe(201);
    }
  });

  it("reports database-aware health as 200 or 503 with empty bodies", async () => {
    const healthy = await handle(makeRequest("/api/HealthCheck"));
    expect(healthy.status).toBe(200);
    expect(await healthy.text()).toBe("");

    repository.ping.mockRejectedValueOnce(new Error("secret driver detail"));
    const unhealthy = await handle(makeRequest("/API/HEALTHCHECK"));
    expect(unhealthy.status).toBe(503);
    expect(await unhealthy.text()).toBe("");
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("returns a safe generic 500 response for repository errors", async () => {
    repository.getAllLogs.mockRejectedValueOnce(
      new Error("mongodb://user:password@private-host"),
    );

    const response = await handle(makeRequest("/api/LiftLogs"));

    expect(response.status).toBe(500);
    const body = await response.text();
    expect(body).toContain("Internal Server Error");
    expect(body).not.toContain("password");
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("serves case-insensitive Swagger UI and OpenAPI JSON", async () => {
    const ui = await handle(makeRequest("/SWAGGER/INDEX.HTML"));
    expect(ui.status).toBe(200);
    expect(ui.headers.get("content-type")).toContain("text/html");
    expect(await ui.text()).toContain("SwaggerUIBundle");

    const spec = await handle(makeRequest("/swagger/v1/swagger.json"));
    expect(spec.status).toBe(200);
    const document = (await spec.json()) as {
      paths: Record<string, { get?: { responses: Record<string, unknown> } }>;
    };
    expect(document.paths["/api/LiftLogs"]).toBeDefined();
    expect(
      document.paths["/api/HealthCheck"].get?.responses["429"],
    ).toBeDefined();
  });

  it("handles allowed and rejected CORS preflights without credentials", async () => {
    handle = createApiHandler({
      getRepository,
      auth,
      logger,
      allowedOrigins: ["https://preview.example"],
    });

    const allowed = await handle(
      makeRequest("/api/LiftLogs/squats/Lifts", {
        method: "OPTIONS",
        headers: {
          origin: "https://preview.example",
          "access-control-request-method": "POST",
          "access-control-request-headers": "content-type",
        },
      }),
    );
    expect(allowed.status).toBe(204);
    expect(allowed.headers.get("access-control-allow-origin")).toBe(
      "https://preview.example",
    );
    expect(allowed.headers.get("access-control-allow-headers")).toBe(
      "content-type",
    );
    expect(allowed.headers.has("access-control-allow-credentials")).toBe(false);

    const rejected = await handle(
      makeRequest("/api/LiftLogs", {
        method: "OPTIONS",
        headers: { origin: "https://attacker.example" },
      }),
    );
    expect(rejected.status).toBe(403);
  });


  it("renames a log title and returns an empty 204", async () => {
    const response = await handle(
      jsonRequest("/api/LiftLogs/SqUaTs", { title: "Back Squats" }, "PUT"),
    );

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(repository.updateLog).toHaveBeenCalledWith("squats", {
      title: "Back Squats",
    });
  });

  it("returns 404 when renaming a missing log and 400 for an invalid title", async () => {
    repository.updateLog.mockResolvedValueOnce(false);
    const missing = await handle(
      jsonRequest("/api/LiftLogs/missing", { title: "Nope" }, "PUT"),
    );
    expect(missing.status).toBe(404);

    const invalid = await handle(
      jsonRequest("/api/LiftLogs/squats", { title: "x".repeat(51) }, "PUT"),
    );
    expect(invalid.status).toBe(400);
  });

  it("deletes a log and reports a missing one as 404", async () => {
    const deleted = await handle(
      makeRequest("/api/LiftLogs/SqUaTs", { method: "DELETE" }),
    );
    expect(deleted.status).toBe(204);
    expect(repository.deleteLog).toHaveBeenCalledWith("squats");

    repository.deleteLog.mockResolvedValueOnce(false);
    const missing = await handle(
      makeRequest("/api/LiftLogs/missing", { method: "DELETE" }),
    );
    expect(missing.status).toBe(404);
  });

  it("updates one entry by its ordinal id with normalized nulls", async () => {
    const response = await handle(
      jsonRequest(
        "/API/LiftLogs/SqUaTs/LiFtS/3",
        { ...sampleEntry, comment: undefined, links: undefined },
        "PUT",
      ),
    );

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(repository.updateEntry).toHaveBeenCalledWith("squats", 3, {
      name: sampleEntry.name,
      weightLifted: sampleEntry.weightLifted,
      date: sampleEntry.date,
      sets: sampleEntry.sets,
      comment: null,
      links: null,
    });
  });

  it("returns 404 when updating a missing entry and validates the payload", async () => {
    repository.updateEntry.mockResolvedValueOnce(false);
    const missing = await handle(
      jsonRequest("/api/LiftLogs/squats/Lifts/9", sampleEntry, "PUT"),
    );
    expect(missing.status).toBe(404);

    const invalid = await handle(
      jsonRequest(
        "/api/LiftLogs/squats/Lifts/9",
        { ...sampleEntry, weightLifted: 1000 },
        "PUT",
      ),
    );
    expect(invalid.status).toBe(400);
  });

  it("deletes one entry and reports a missing one as 404", async () => {
    const deleted = await handle(
      makeRequest("/api/LiftLogs/SqUaTs/Lifts/2", { method: "DELETE" }),
    );
    expect(deleted.status).toBe(204);
    expect(repository.deleteEntry).toHaveBeenCalledWith("squats", 2);

    repository.deleteEntry.mockResolvedValueOnce(false);
    const missing = await handle(
      makeRequest("/api/LiftLogs/squats/Lifts/2", { method: "DELETE" }),
    );
    expect(missing.status).toBe(404);
  });

  it.each(["abc", "-1", "1.5"])(
    "rejects the non-ordinal entry id %s before touching the database",
    async (entryId) => {
      const response = await handle(
        makeRequest(`/api/LiftLogs/squats/Lifts/${entryId}`, {
          method: "DELETE",
        }),
      );

      expect(response.status).toBe(400);
      expect(repository.deleteEntry).not.toHaveBeenCalled();
    },
  );

  it("rejects unsupported methods on a single entry", async () => {
    const response = await handle(
      makeRequest("/api/LiftLogs/squats/Lifts/1", { method: "GET" }),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("PUT, DELETE, OPTIONS");
  });


  it("hands every /api/auth route to Better Auth untouched, cookies included", async () => {
    const response = await handle(
      makeRequest("/api/auth/callback/google?code=abc"),
    );

    expect(auth.handleAuthRequest).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    // finalizeResponse must not rewrite Better Auth's own headers.
    expect(response.headers.get("set-cookie")).toContain("session_token");
    expect(response.headers.get("cache-control")).toBeNull();
    expect(getRepository).not.toHaveBeenCalled();
  });

  it("serves the health check without a session but nothing else", async () => {
    handle = createApiHandler({ getRepository, auth: createAuth(null), logger });

    const healthy = await handle(makeRequest("/api/HealthCheck"));
    expect(healthy.status).toBe(200);

    for (const path of ["/api/LiftLogs", "/api/LiftLogs/squats", "/swagger"]) {
      const response = await handle(makeRequest(path));
      expect(response.status).toBe(401);
    }
    expect(repository.getAllLogs).not.toHaveBeenCalled();
    expect(repository.getLog).not.toHaveBeenCalled();
  });

  it("refuses signed-out writes before reading the request body", async () => {
    handle = createApiHandler({ getRepository, auth: createAuth(null), logger });

    const added = await handle(
      jsonRequest("/api/LiftLogs/squats/Lifts", sampleEntry),
    );
    expect(added.status).toBe(401);

    const deleted = await handle(
      makeRequest("/api/LiftLogs/squats/Lifts/0", { method: "DELETE" }),
    );
    expect(deleted.status).toBe(401);

    expect(repository.addEntry).not.toHaveBeenCalled();
    expect(repository.deleteEntry).not.toHaveBeenCalled();
  });

  it("lets any signed-in user read logs and write entries", async () => {
    handle = createApiHandler({
      getRepository,
      auth: createAuth(memberSession),
      logger,
    });

    expect((await handle(makeRequest("/api/LiftLogs/squats"))).status).toBe(200);
    expect(
      (await handle(jsonRequest("/api/LiftLogs/squats/Lifts", sampleEntry)))
        .status,
    ).toBe(201);
    expect(
      (await handle(jsonRequest("/api/LiftLogs/squats/Lifts/0", sampleEntry, "PUT")))
        .status,
    ).toBe(204);
    expect(
      (await handle(makeRequest("/api/LiftLogs/squats/Lifts/0", { method: "DELETE" })))
        .status,
    ).toBe(204);
  });

  it("reserves creating, renaming and deleting logs for the administrator", async () => {
    handle = createApiHandler({
      getRepository,
      auth: createAuth(memberSession),
      logger,
    });

    const created = await handle(
      jsonRequest("/api/LiftLogs", { title: "Squats", name: "squats" }),
    );
    expect(created.status).toBe(403);

    const renamed = await handle(
      jsonRequest("/api/LiftLogs/squats", { title: "Back Squats" }, "PUT"),
    );
    expect(renamed.status).toBe(403);

    const deleted = await handle(
      makeRequest("/api/LiftLogs/squats", { method: "DELETE" }),
    );
    expect(deleted.status).toBe(403);

    expect(repository.createLog).not.toHaveBeenCalled();
    expect(repository.updateLog).not.toHaveBeenCalled();
    expect(repository.deleteLog).not.toHaveBeenCalled();
  });

  it("reports who is signed in and whether they administer logs", async () => {
    const asAdmin = await handle(makeRequest("/api/me"));
    expect(asAdmin.status).toBe(200);
    expect(await asAdmin.json()).toEqual({
      email: "admin@example.com",
      name: "Admin",
      isAdmin: true,
    });

    handle = createApiHandler({
      getRepository,
      auth: createAuth(memberSession),
      logger,
    });
    const asMember = await handle(makeRequest("/api/me"));
    expect(await asMember.json()).toEqual({
      email: "member@example.com",
      name: "Member",
      isAdmin: false,
    });

    handle = createApiHandler({ getRepository, auth: createAuth(null), logger });
    expect((await handle(makeRequest("/api/me"))).status).toBe(401);
  });

  it("returns empty 404/405 responses for unsupported routes and methods", async () => {
    const notFound = await handle(makeRequest("/api/unknown"));
    expect(notFound.status).toBe(404);
    expect(await notFound.text()).toBe("");

    const notAllowed = await handle(
      makeRequest("/api/LiftLogs/squats", { method: "PATCH" }),
    );
    expect(notAllowed.status).toBe(405);
    expect(notAllowed.headers.get("allow")).toBe("GET, PUT, DELETE, OPTIONS");
  });
});
