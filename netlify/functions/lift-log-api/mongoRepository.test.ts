// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { type Db, ObjectId } from "mongodb";
import {
  COLLECTION_NAMES,
  LOG_ORDINAL_COUNTER_ID,
  MongoLiftLogRepository,
  ensureMongoIndexes,
} from "./mongoRepository";

type CollectionStubs = Record<string, Record<string, ReturnType<typeof vi.fn>>>;

const createDatabase = (stubs: CollectionStubs): Db =>
  ({
    collection: vi.fn((name: string) => stubs[name]),
    command: vi.fn(async () => ({ ok: 1 })),
  }) as unknown as Db;

describe("MongoLiftLogRepository", () => {
  it("creates the required unique indexes idempotently", async () => {
    const logsCreateIndexes = vi.fn(async () => []);
    const entriesCreateIndexes = vi.fn(async () => []);
    const database = createDatabase({
      [COLLECTION_NAMES.logs]: { createIndexes: logsCreateIndexes },
      [COLLECTION_NAMES.logEntries]: {
        createIndexes: entriesCreateIndexes,
      },
    });

    await ensureMongoIndexes(database);

    expect(logsCreateIndexes).toHaveBeenCalledWith([
      expect.objectContaining({ key: { name: 1 }, unique: true }),
      expect.objectContaining({ key: { ordinal: 1 }, unique: true }),
    ]);
    expect(entriesCreateIndexes).toHaveBeenCalledWith([
      expect.objectContaining({
        key: { logId: 1, ordinal: 1 },
        unique: true,
      }),
    ]);
  });

  it("allocates the current zero-based counter ordinal and initializes entry allocation", async () => {
    const insertOne = vi.fn(async () => ({ acknowledged: true }));
    const findOneAndUpdate = vi.fn(async () => ({
      _id: LOG_ORDINAL_COUNTER_ID,
      nextOrdinal: 11,
    }));
    const database = createDatabase({
      [COLLECTION_NAMES.logs]: {
        insertOne,
        findOne: vi.fn(),
      },
      [COLLECTION_NAMES.logEntries]: {},
      [COLLECTION_NAMES.counters]: { findOneAndUpdate },
    });
    const repository = new MongoLiftLogRepository(database);

    await repository.createLog({ name: "NeWLog", title: "New Log" });

    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { _id: LOG_ORDINAL_COUNTER_ID },
      { $inc: { nextOrdinal: 1 } },
      { upsert: true, returnDocument: "after" },
    );
    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "newlog",
        title: "New Log",
        ordinal: 10,
        nextEntryOrdinal: 0,
      }),
    );
  });

  it("allocates the current next-entry ordinal and stores one entry document", async () => {
    const logId = new ObjectId();
    const findOneAndUpdate = vi.fn(async () => ({
      _id: logId,
      nextEntryOrdinal: 8,
    }));
    const insertOne = vi.fn(async () => ({ acknowledged: true }));
    const database = createDatabase({
      [COLLECTION_NAMES.logs]: { findOneAndUpdate },
      [COLLECTION_NAMES.logEntries]: { insertOne },
      [COLLECTION_NAMES.counters]: {},
    });
    const repository = new MongoLiftLogRepository(database);

    const wasAdded = await repository.addEntry("SqUaTs", {
      name: "Arnold",
      weightLifted: 100,
      date: "2026-07-11T12:00:00.000Z",
      sets: [],
      comment: null,
      links: null,
    });

    expect(wasAdded).toBe(true);
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { name: "squats" },
      { $inc: { nextEntryOrdinal: 1 } },
      expect.objectContaining({ returnDocument: "after" }),
    );
    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        logId,
        ordinal: 7,
        name: "Arnold",
        date: new Date("2026-07-11T12:00:00.000Z"),
      }),
    );
  });

  it("does not create an entry document when the log is missing", async () => {
    const insertOne = vi.fn();
    const database = createDatabase({
      [COLLECTION_NAMES.logs]: {
        findOneAndUpdate: vi.fn(async () => null),
      },
      [COLLECTION_NAMES.logEntries]: { insertOne },
      [COLLECTION_NAMES.counters]: {},
    });
    const repository = new MongoLiftLogRepository(database);

    expect(
      await repository.addEntry("missing", {
        name: "Arnold",
        weightLifted: 100,
        date: "2026-07-11T12:00:00.000Z",
        sets: [],
        comment: null,
        links: null,
      }),
    ).toBe(false);
    expect(insertOne).not.toHaveBeenCalled();
  });

  it("reconstructs a log by entry ordinal without exposing Mongo IDs", async () => {
    const logId = new ObjectId();
    const entryId = new ObjectId();
    const sort = vi.fn(() => ({
      toArray: vi.fn(async () => [
        {
          _id: entryId,
          logId,
          ordinal: 0,
          name: "Arnold",
          weightLifted: 100,
          date: new Date("2026-07-11T12:00:00.000Z"),
          sets: [],
          comment: null,
          links: null,
          createdAt: new Date(),
        },
      ]),
    }));
    const database = createDatabase({
      [COLLECTION_NAMES.logs]: {
        findOne: vi.fn(async () => ({
          _id: logId,
          name: "squats",
          title: "Squats",
          ordinal: 0,
          nextEntryOrdinal: 1,
          createdAt: new Date(),
        })),
      },
      [COLLECTION_NAMES.logEntries]: {
        find: vi.fn(() => ({ sort })),
      },
      [COLLECTION_NAMES.counters]: {},
    });
    const repository = new MongoLiftLogRepository(database);

    const log = await repository.getLog("SQUATS");

    expect(sort).toHaveBeenCalledWith({ ordinal: 1 });
    expect(log).toEqual({
      name: "squats",
      title: "Squats",
      entries: [
        {
          name: "Arnold",
          weightLifted: 100,
          date: "2026-07-11T12:00:00.000Z",
          sets: [],
          comment: null,
          links: null,
        },
      ],
    });
    expect(JSON.stringify(log)).not.toContain(entryId.toHexString());
  });
});
