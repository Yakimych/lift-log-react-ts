// @vitest-environment node

import { MongoClient, type Db } from "mongodb";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { COLLECTION_NAMES, MongoLiftLogRepository } from "./mongoRepository";

const uri = process.env.MONGODB_INTEGRATION_URI;
const integrationDescribe = uri ? describe : describe.skip;

integrationDescribe("MongoLiftLogRepository with MongoDB 8", () => {
  let client: MongoClient;
  let database: Db;
  let repository: MongoLiftLogRepository;

  beforeAll(async () => {
    client = new MongoClient(uri as string, { maxPoolSize: 5 });
    await client.connect();
    database = client.db(`lift_log_integration_${Date.now()}`);
    repository = new MongoLiftLogRepository(database);
    await repository.initialize();
  });

  afterAll(async () => {
    if (database) {
      await database.dropDatabase();
    }
    if (client) {
      await client.close();
    }
  });

  it("stores one document per entry and allocates stable ordinals atomically", async () => {
    await repository.createLog({ name: "Squats", title: "Squats" });

    const duplicateEntry = {
      name: "Ada",
      weightLifted: 100,
      date: "2026-07-12T08:00:00.000Z",
      sets: [{ numberOfReps: 5, rpe: 8.5 }],
      comment: null,
      links: null,
    };

    const results = await Promise.all(
      Array.from({ length: 20 }, () =>
        repository.addEntry("sQuAtS", duplicateEntry),
      ),
    );
    expect(results).toEqual(Array(20).fill(true));

    const logDocument = await database
      .collection(COLLECTION_NAMES.logs)
      .findOne({ name: "squats" });
    expect(logDocument).toMatchObject({
      ordinal: 0,
      nextEntryOrdinal: 20,
    });

    const entryDocuments = await database
      .collection(COLLECTION_NAMES.logEntries)
      .find({ logId: logDocument?._id })
      .sort({ ordinal: 1 })
      .toArray();
    expect(entryDocuments).toHaveLength(20);
    expect(entryDocuments.map((entry) => entry.ordinal)).toEqual(
      Array.from({ length: 20 }, (_, ordinal) => ordinal),
    );

    const aggregate = await repository.getLog("SQUATS");
    expect(aggregate?.entries).toHaveLength(20);
    expect(aggregate?.entries[0]).toEqual(duplicateEntry);
    expect(JSON.stringify(aggregate)).not.toContain("_id");
  });

  it("allocates unique global log ordinals under concurrent writes", async () => {
    await Promise.all(
      Array.from({ length: 12 }, (_, index) =>
        repository.createLog({
          name: `log-${index}`,
          title: `Log ${index}`,
        }),
      ),
    );

    const ordinals = await database
      .collection(COLLECTION_NAMES.logs)
      .find({}, { projection: { ordinal: 1 } })
      .sort({ ordinal: 1 })
      .map((log) => log.ordinal)
      .toArray();

    expect(new Set(ordinals).size).toBe(ordinals.length);
    expect(ordinals).toEqual(Array.from({ length: 13 }, (_, value) => value));
  });

  it("does not create an entry for a missing log", async () => {
    const before = await database
      .collection(COLLECTION_NAMES.logEntries)
      .countDocuments();
    expect(
      await repository.addEntry("missing", {
        name: "Ada",
        weightLifted: 1,
        date: "2026-07-12T08:00:00.000Z",
        sets: [],
        comment: null,
        links: null,
      }),
    ).toBe(false);
    expect(
      await database.collection(COLLECTION_NAMES.logEntries).countDocuments(),
    ).toBe(before);
  });
});
