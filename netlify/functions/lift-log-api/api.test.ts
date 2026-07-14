// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApiHandler } from "./api";
import { config } from "./index";
import {
  DuplicateLogError,
  type ApiLiftLog,
  type ApiLiftLogEntry,
  type CreateLiftLog,
  type LiftLogRepository,
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
  entries: [sampleEntry],
};

const makeRequest = (path: string, init?: RequestInit): Request =>
  new Request(`${baseUrl}${path}`, init);

const jsonRequest = (path: string, body: unknown): Request =>
  makeRequest(path, {
    method: "POST",
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
  addEntry: vi.fn(
    async (logName: string, entry: ApiLiftLogEntry): Promise<boolean> => {
      void logName;
      void entry;
      return true;
    },
  ),
  ping: vi.fn(async () => undefined),
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
  let handle: ReturnType<typeof createApiHandler>;

  beforeEach(() => {
    repository = createRepository();
    logger = { error: vi.fn() };
    getRepository = vi.fn(async () => repository as LiftLogRepository);
    handle = createApiHandler({ getRepository, logger });
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

  it("returns empty 404/405 responses for unsupported routes and methods", async () => {
    const notFound = await handle(makeRequest("/api/unknown"));
    expect(notFound.status).toBe(404);
    expect(await notFound.text()).toBe("");

    const notAllowed = await handle(
      makeRequest("/api/LiftLogs/squats", { method: "DELETE" }),
    );
    expect(notAllowed.status).toBe(405);
    expect(notAllowed.headers.get("allow")).toBe("GET, OPTIONS");
  });
});
