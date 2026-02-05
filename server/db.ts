import { eq, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  sessions, 
  degrees, 
  brothers, 
  workers, 
  powers, 
  certificates,
  InsertSession,
  InsertDegree,
  InsertBrother,
  InsertWorker,
  InsertPower,
  InsertCertificate
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= USERS =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId && !user.email) {
    throw new Error("User openId or email is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = user.openId ? { openId: user.openId } : { email: user.email };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "password"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(users).where(eq(users.id, id));
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, id));
}

// ============= SESSIONS =============

export async function createSession(session: InsertSession) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(sessions).values(session);
  return null;
}

export async function getAllSessions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessions).orderBy(sessions.name);
}

export async function updateSession(id: number, data: Partial<InsertSession>) {
  const db = await getDb();
  if (!db) return;
  await db.update(sessions).set(data).where(eq(sessions.id, id));
}

export async function deleteSession(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(sessions).where(eq(sessions.id, id));
}

// ============= DEGREES =============

export async function createDegree(degree: InsertDegree) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(degrees).values(degree);
  return null;
}

export async function getAllDegrees() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(degrees).orderBy(degrees.name);
}

export async function updateDegree(id: number, data: Partial<InsertDegree>) {
  const db = await getDb();
  if (!db) return;
  await db.update(degrees).set(data).where(eq(degrees.id, id));
}

export async function deleteDegree(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(degrees).where(eq(degrees.id, id));
}

// ============= BROTHERS =============

export async function createBrother(brother: InsertBrother) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(brothers).values(brother);
  return null;
}

export async function getAllBrothers(initial?: string) {
  const db = await getDb();
  if (!db) return [];
  if (initial) {
    return await db.select().from(brothers).where(like(brothers.name, `${initial}%`)).orderBy(brothers.name);
  }
  return await db.select().from(brothers).orderBy(brothers.name);
}

export async function updateBrother(id: number, data: Partial<InsertBrother>) {
  const db = await getDb();
  if (!db) return;
  await db.update(brothers).set(data).where(eq(brothers.id, id));
}

export async function deleteBrother(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(brothers).where(eq(brothers.id, id));
}

// ============= WORKERS =============

export async function createWorker(worker: InsertWorker) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(workers).values(worker);
  return null;
}

export async function getAllWorkers(initial?: string) {
  const db = await getDb();
  if (!db) return [];
  if (initial) {
    return await db.select().from(workers).where(like(workers.name, `${initial}%`)).orderBy(workers.name);
  }
  return await db.select().from(workers).orderBy(workers.name);
}

export async function updateWorker(id: number, data: Partial<InsertWorker>) {
  const db = await getDb();
  if (!db) return;
  await db.update(workers).set(data).where(eq(workers.id, id));
}

export async function deleteWorker(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(workers).where(eq(workers.id, id));
}

// ============= POWERS =============

export async function createPower(power: InsertPower) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(powers).values(power);
  return null;
}

export async function getAllPowers(initial?: string) {
  const db = await getDb();
  if (!db) return [];
  if (initial) {
    return await db.select().from(powers).where(like(powers.name, `${initial}%`)).orderBy(powers.name);
  }
  return await db.select().from(powers).orderBy(powers.name);
}

export async function updatePower(id: number, data: Partial<InsertPower>) {
  const db = await getDb();
  if (!db) return;
  await db.update(powers).set(data).where(eq(powers.id, id));
}

export async function deletePower(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(powers).where(eq(powers.id, id));
}

// ============= CERTIFICATES =============

export async function createCertificate(certificate: InsertCertificate) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(certificates).values(certificate);
  return null;
}

export async function getAllCertificates() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(certificates).orderBy(desc(certificates.createdAt));
}

export async function updateCertificate(id: number, data: Partial<InsertCertificate>) {
  const db = await getDb();
  if (!db) return;
  await db.update(certificates).set(data).where(eq(certificates.id, id));
}
