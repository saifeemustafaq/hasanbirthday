import clientPromise from "./mongodb";

const DB = "hasanbirthday";
const ATTENDEES = "attendees";
const COUNTERS = "counters";

export interface Attendee {
  mobile: string;
  name: string;
  token: number;
  createdAt: Date;
}

async function getDb() {
  const client = await clientPromise;
  return client.db(DB);
}

/** Ensure indexes and seed the counter doc on first use. */
async function bootstrap() {
  const db = await getDb();
  await db.collection(ATTENDEES).createIndex({ mobile: 1 }, { unique: true });
  await db.collection(COUNTERS).updateOne(
    { _id: "attendee_token" as unknown as import("mongodb").ObjectId },
    { $setOnInsert: { seq: 0 } },
    { upsert: true }
  );
}

let bootstrapped = false;
async function ensureBootstrapped() {
  if (!bootstrapped) {
    await bootstrap();
    bootstrapped = true;
  }
}

/** Atomically increment and return the next token number. */
async function nextToken(): Promise<number> {
  const db = await getDb();
  const result = await db.collection(COUNTERS).findOneAndUpdate(
    { _id: "attendee_token" as unknown as import("mongodb").ObjectId },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );
  return (result as unknown as { seq: number }).seq;
}

export type RegisterResult =
  | { status: "created"; token: number; name: string }
  | { status: "exists"; token: number; name: string };

/** Register a new attendee or return their existing token. */
export async function registerAttendee(
  name: string,
  mobile: string
): Promise<RegisterResult> {
  await ensureBootstrapped();
  const db = await getDb();
  const col = db.collection<Attendee>(ATTENDEES);

  const existing = await col.findOne({ mobile });
  if (existing) {
    return { status: "exists", token: existing.token, name: existing.name };
  }

  const token = await nextToken();
  await col.insertOne({ mobile, name, token, createdAt: new Date() });
  return { status: "created", token, name };
}

/** Return all attendees sorted by token. */
export async function listAttendees(): Promise<Attendee[]> {
  await ensureBootstrapped();
  const db = await getDb();
  return db
    .collection<Attendee>(ATTENDEES)
    .find({})
    .sort({ token: 1 })
    .toArray() as unknown as Attendee[];
}

/** Delete an attendee by mobile. Returns true if a document was removed. */
export async function deleteAttendee(mobile: string): Promise<boolean> {
  await ensureBootstrapped();
  const db = await getDb();
  const result = await db.collection(ATTENDEES).deleteOne({ mobile });
  return result.deletedCount === 1;
}

/** Update an attendee's name (and optionally mobile) by current mobile. */
export async function updateAttendee(
  mobile: string,
  patch: { name?: string; mobile?: string }
): Promise<boolean> {
  await ensureBootstrapped();
  const db = await getDb();
  const result = await db
    .collection(ATTENDEES)
    .updateOne({ mobile }, { $set: patch });
  return result.matchedCount === 1;
}
