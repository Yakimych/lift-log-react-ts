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
    expect(aggregate?.entries[0]).toEqual({ id: 0, ...duplicateEntry });
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

  it("edits and deletes one entry by its ordinal without shifting the others", async () => {
    await repository.createLog({ name: "edits", title: "Edits" });
    for (const weightLifted of [100, 110, 120]) {
      await repository.addEntry("edits", {
        name: "Ada",
        weightLifted,
        date: "2026-07-12T08:00:00.000Z",
        sets: [{ numberOfReps: 5, rpe: null }],
        comment: null,
        links: null,
      });
    }

    expect(
      await repository.updateEntry("EDITS", 1, {
        name: "Grace",
        weightLifted: 115,
        date: "2026-07-13T08:00:00.000Z",
        sets: [{ numberOfReps: 3, rpe: 9 }],
        comment: "Edited",
        links: [{ text: "Video", url: "https://example.com" }],
      }),
    ).toBe(true);

    expect(await repository.deleteEntry("edits", 0)).toBe(true);
    expect(await repository.deleteEntry("edits", 0)).toBe(false);

    const log = await repository.getLog("edits");
    expect(log?.entries).toEqual([
      {
        id: 1,
        name: "Grace",
        weightLifted: 115,
        date: "2026-07-13T08:00:00.000Z",
        sets: [{ numberOfReps: 3, rpe: 9 }],
        comment: "Edited",
        links: [{ text: "Video", url: "https://example.com" }],
      },
      {
        id: 2,
        name: "Ada",
        weightLifted: 120,
        date: "2026-07-12T08:00:00.000Z",
        sets: [{ numberOfReps: 5, rpe: null }],
        comment: null,
        links: null,
      },
    ]);

    // New entries keep taking fresh ordinals, so a deleted id is never reused.
    await repository.addEntry("edits", {
      name: "Ada",
      weightLifted: 130,
      date: "2026-07-14T08:00:00.000Z",
      sets: [],
      comment: null,
      links: null,
    });
    const reloaded = await repository.getLog("edits");
    expect(reloaded?.entries.map((entry) => entry.id)).toEqual([1, 2, 3]);
  });

  it("renames a log title and deletes a log together with its entries", async () => {
    await repository.createLog({ name: "doomed", title: "Doomed" });
    await repository.addEntry("doomed", {
      name: "Ada",
      weightLifted: 100,
      date: "2026-07-12T08:00:00.000Z",
      sets: [],
      comment: null,
      links: null,
    });

    expect(await repository.updateLog("DOOMED", { title: "Renamed" })).toBe(
      true,
    );
    expect((await repository.getLog("doomed"))?.title).toBe("Renamed");
    expect(await repository.updateLog("missing", { title: "Nope" })).toBe(
      false,
    );

    const logDocument = await database
      .collection(COLLECTION_NAMES.logs)
      .findOne({ name: "doomed" });

    expect(await repository.deleteLog("DoOmEd")).toBe(true);
    expect(await repository.getLog("doomed")).toBeNull();
    expect(
      await database
        .collection(COLLECTION_NAMES.logEntries)
        .countDocuments({ logId: logDocument?._id }),
    ).toBe(0);
    expect(await repository.deleteLog("doomed")).toBe(false);
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
