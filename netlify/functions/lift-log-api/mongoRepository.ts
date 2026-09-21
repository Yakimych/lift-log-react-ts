import {
  Db,
  MongoClient,
  MongoServerError,
  ObjectId,
  type IndexDescription,
} from "mongodb";
import {
  DuplicateLogError,
  type ApiLiftLog,
  type ApiLiftLogEntry,
  type ApiLink,
  type ApiSet,
  type ApiStoredLiftLogEntry,
  type CreateLiftLog,
  type LiftLogRepository,
  type UpdateLiftLog,
} from "./types";

export const COLLECTION_NAMES = {
  logs: "logs",
  logEntries: "logEntries",
  counters: "counters",
} as const;

export const LOG_ORDINAL_COUNTER_ID = "logOrdinal";

type LogDocument = {
  _id: ObjectId;
  name: string;
  title: string;
  ordinal: number;
  nextEntryOrdinal: number;
  createdAt: Date;
};

type LogEntryDocument = {
  _id: ObjectId;
  logId: ObjectId;
  ordinal: number;
  name: string;
  weightLifted: number;
  date: Date;
  sets: ApiSet[];
  comment: string | null;
  links: ApiLink[] | null;
  createdAt: Date;
};

type CounterDocument = {
  _id: string;
  nextOrdinal: number;
};

const logIndexes: IndexDescription[] = [
  {
    key: { name: 1 },
    name: "uniq_logs_name",
    unique: true,
  },
  {
    key: { ordinal: 1 },
    name: "uniq_logs_ordinal",
    unique: true,
  },
];

const logEntryIndexes: IndexDescription[] = [
  {
    key: { logId: 1, ordinal: 1 },
    name: "uniq_log_entries_log_ordinal",
    unique: true,
  },
];

export const ensureMongoIndexes = async (database: Db): Promise<void> => {
  await Promise.all([
    database
      .collection<LogDocument>(COLLECTION_NAMES.logs)
      .createIndexes(logIndexes),
    database
      .collection<LogEntryDocument>(COLLECTION_NAMES.logEntries)
      .createIndexes(logEntryIndexes),
  ]);
};

const normalizeLogName = (logName: string): string => logName.toLowerCase();

const isDuplicateKeyError = (error: unknown): error is MongoServerError =>
  error instanceof MongoServerError && error.code === 11000;

const toApiEntry = (entry: LogEntryDocument): ApiStoredLiftLogEntry => ({
  id: entry.ordinal,
  name: entry.name,
  weightLifted: entry.weightLifted,
  date: entry.date.toISOString(),
  sets: entry.sets,
  comment: entry.comment ?? null,
  links: entry.links ?? null,
});

export class MongoLiftLogRepository implements LiftLogRepository {
  private readonly logs;
  private readonly logEntries;
  private readonly counters;

  public constructor(private readonly database: Db) {
    this.logs = database.collection<LogDocument>(COLLECTION_NAMES.logs);
    this.logEntries = database.collection<LogEntryDocument>(
      COLLECTION_NAMES.logEntries,
    );
    this.counters = database.collection<CounterDocument>(
      COLLECTION_NAMES.counters,
    );
  }

  public async initialize(): Promise<void> {
    await ensureMongoIndexes(this.database);
  }

  public async createLog(log: CreateLiftLog): Promise<void> {
    const name = normalizeLogName(log.name);
    const counter = await this.counters.findOneAndUpdate(
      { _id: LOG_ORDINAL_COUNTER_ID },
      { $inc: { nextOrdinal: 1 } },
      { upsert: true, returnDocument: "after" },
    );

    if (!counter) {
      throw new Error("Could not allocate a log ordinal");
    }

    const now = new Date();
    const ordinal = counter.nextOrdinal - 1;

    try {
      await this.logs.insertOne({
        _id: new ObjectId(),
        name,
        title: log.title,
        ordinal,
        nextEntryOrdinal: 0,
        createdAt: now,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const existingLog = await this.logs.findOne(
          { name },
          { projection: { _id: 1 } },
        );
        if (existingLog) {
          throw new DuplicateLogError(name);
        }
      }

      throw error;
    }
  }

  public async getAllLogs(): Promise<ApiLiftLog[]> {
    const logs = await this.logs.find({}).sort({ ordinal: 1 }).toArray();
    if (logs.length === 0) {
      return [];
    }

    const logIds = logs.map((log) => log._id);
    const entries = await this.logEntries
      .find({ logId: { $in: logIds } })
      .sort({ logId: 1, ordinal: 1 })
      .toArray();
    const entriesByLogId = new Map<string, ApiStoredLiftLogEntry[]>();

    for (const entry of entries) {
      const key = entry.logId.toHexString();
      const groupedEntries = entriesByLogId.get(key) ?? [];
      groupedEntries.push(toApiEntry(entry));
      entriesByLogId.set(key, groupedEntries);
    }

    return logs.map((log) => ({
      name: log.name,
      title: log.title,
      entries: entriesByLogId.get(log._id.toHexString()) ?? [],
    }));
  }

  public async getLog(logName: string): Promise<ApiLiftLog | null> {
    const log = await this.logs.findOne({ name: normalizeLogName(logName) });
    if (!log) {
      return null;
    }

    const entries = await this.logEntries
      .find({ logId: log._id })
      .sort({ ordinal: 1 })
      .toArray();

    return {
      name: log.name,
      title: log.title,
      entries: entries.map(toApiEntry),
    };
  }

  public async updateLog(
    logName: string,
    log: UpdateLiftLog,
  ): Promise<boolean> {
    const result = await this.logs.updateOne(
      { name: normalizeLogName(logName) },
      { $set: { title: log.title } },
    );

    return result.matchedCount > 0;
  }

  public async deleteLog(logName: string): Promise<boolean> {
    const log = await this.logs.findOne(
      { name: normalizeLogName(logName) },
      { projection: { _id: 1 } },
    );

    if (!log) {
      return false;
    }

    // Entries go first so a failure halfway through never leaves entries
    // orphaned by a log that is already gone.
    await this.logEntries.deleteMany({ logId: log._id });
    await this.logs.deleteOne({ _id: log._id });

    return true;
  }

  public async addEntry(
    logName: string,
    entry: ApiLiftLogEntry,
  ): Promise<boolean> {
    const log = await this.logs.findOneAndUpdate(
      { name: normalizeLogName(logName) },
      { $inc: { nextEntryOrdinal: 1 } },
      {
        returnDocument: "after",
        projection: { _id: 1, nextEntryOrdinal: 1 },
      },
    );

    if (!log) {
      return false;
    }

    await this.logEntries.insertOne({
      _id: new ObjectId(),
      logId: log._id,
      ordinal: log.nextEntryOrdinal - 1,
      name: entry.name,
      weightLifted: entry.weightLifted,
      date: new Date(entry.date),
      sets: entry.sets,
      comment: entry.comment,
      links: entry.links,
      createdAt: new Date(),
    });

    return true;
  }

  public async updateEntry(
    logName: string,
    entryId: number,
    entry: ApiLiftLogEntry,
  ): Promise<boolean> {
    const log = await this.logs.findOne(
      { name: normalizeLogName(logName) },
      { projection: { _id: 1 } },
    );

    if (!log) {
      return false;
    }

    const result = await this.logEntries.updateOne(
      { logId: log._id, ordinal: entryId },
      {
        $set: {
          name: entry.name,
          weightLifted: entry.weightLifted,
          date: new Date(entry.date),
          sets: entry.sets,
          comment: entry.comment,
          links: entry.links,
        },
      },
    );

    return result.matchedCount > 0;
  }

  public async deleteEntry(logName: string, entryId: number): Promise<boolean> {
    const log = await this.logs.findOne(
      { name: normalizeLogName(logName) },
      { projection: { _id: 1 } },
    );

    if (!log) {
      return false;
    }

    const result = await this.logEntries.deleteOne({
      logId: log._id,
      ordinal: entryId,
    });

    return result.deletedCount > 0;
  }

  public async ping(): Promise<void> {
    await this.database.command({ ping: 1 });
  }
}

const requireEnvironmentVariable = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not configured`);
  }
  return value;
};

export type MongoConnection = {
  client: MongoClient;
  database: Db;
};

let mongoClientPromise: Promise<MongoClient> | undefined;
let mongoConnectionPromise: Promise<MongoConnection> | undefined;
let mongoRepositoryPromise: Promise<MongoLiftLogRepository> | undefined;

const getMongoClient = (uri: string): Promise<MongoClient> => {
  if (!mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30_000,
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
    });

    mongoClientPromise = client.connect().catch((error) => {
      mongoClientPromise = undefined;
      throw error;
    });
  }

  return mongoClientPromise;
};

/** One pooled connection, shared by the lift log data and by Better Auth. */
export const getMongoConnection = (): Promise<MongoConnection> => {
  if (!mongoConnectionPromise) {
    mongoConnectionPromise = (async () => {
      const uri = requireEnvironmentVariable("MONGODB_URI");
      const databaseName = requireEnvironmentVariable("MONGODB_DATABASE");
      const client = await getMongoClient(uri);
      return { client, database: client.db(databaseName) };
    })().catch((error) => {
      mongoConnectionPromise = undefined;
      throw error;
    });
  }

  return mongoConnectionPromise;
};

export const getMongoRepository = (): Promise<MongoLiftLogRepository> => {
  if (!mongoRepositoryPromise) {
    mongoRepositoryPromise = (async () => {
      const { database } = await getMongoConnection();
      const repository = new MongoLiftLogRepository(database);
      await repository.initialize();
      return repository;
    })().catch((error) => {
      mongoRepositoryPromise = undefined;
      throw error;
    });
  }

  return mongoRepositoryPromise;
};
