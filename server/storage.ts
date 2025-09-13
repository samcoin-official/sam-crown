import { 
  type User, 
  type InsertUser,
  type CrownSession,
  type InsertCrownSession,
  type TokenEarning,
  type InsertTokenEarning,
  type UserCooldown,
  type InsertUserCooldown,
  users,
  crownSessions,
  tokenEarnings,
  userCooldowns
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, isNull, and, lt, sql } from "drizzle-orm";

// Crown game advisory lock ID for serializing crown transitions
const CROWN_GAME_LOCK_ID = 42;

// Crown game storage interface
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWorldId(nullifier: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(userId: string, nullifier: string): Promise<User>;
  updateUserStats(id: string, crownTime: number, tokensEarned: number): Promise<void>;
  
  // Crown game mechanics
  getCurrentCrownHolder(): Promise<(CrownSession & { user: User }) | undefined>;
  stealCrown(fromUserId: string | undefined, toUserId: string): Promise<CrownSession>;
  endCrownSession(sessionId: string, tokensEarned: number): Promise<void>;
  
  // Token earnings
  recordTokenEarning(earning: InsertTokenEarning): Promise<TokenEarning>;
  getUserTokenEarnings(userId: string): Promise<TokenEarning[]>;
  
  // Cooldowns
  getUserCooldown(userId: string, type: string): Promise<UserCooldown | undefined>;
  setCooldown(cooldown: InsertUserCooldown): Promise<UserCooldown>;
  clearExpiredCooldowns(): Promise<void>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByWorldId(nullifier: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.worldIdNullifier, nullifier));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async verifyUser(userId: string, nullifier: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ 
        worldIdNullifier: nullifier,
        isVerified: true,
        verifiedAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserStats(id: string, crownTime: number, tokensEarned: number): Promise<void> {
    await db.update(users)
      .set({ 
        totalCrownTime: sql`${users.totalCrownTime} + ${crownTime}`,
        totalTokensEarned: sql`${users.totalTokensEarned} + ${tokensEarned}::numeric`,
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(eq(users.id, id));
  }

  // Crown game mechanics
  async getCurrentCrownHolder(): Promise<(CrownSession & { user: User }) | undefined> {
    const [session] = await db
      .select()
      .from(crownSessions)
      .leftJoin(users, eq(crownSessions.userId, users.id))
      .where(isNull(crownSessions.endedAt))
      .orderBy(desc(crownSessions.startedAt))
      .limit(1);
    
    if (!session?.crown_sessions || !session?.users) return undefined;
    
    return {
      ...session.crown_sessions,
      user: session.users
    };
  }

  async stealCrown(fromUserId: string | undefined, toUserId: string): Promise<CrownSession> {
    return await db.transaction(async (tx) => {
      // Acquire global advisory lock to serialize crown transitions
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${CROWN_GAME_LOCK_ID})`);
      
      // End ANY active session (ensuring single active session)
      const [prevSession] = await tx
        .select()
        .from(crownSessions)
        .where(isNull(crownSessions.endedAt))
        .limit(1);
      
      if (prevSession) {
        // Calculate duration using server-side timestamps
        const [updatedSession] = await tx
          .update(crownSessions)
          .set({ 
            endedAt: sql`CURRENT_TIMESTAMP`,
            durationSeconds: sql`EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::int`
          })
          .where(eq(crownSessions.id, prevSession.id))
          .returning();
        
        // Update previous holder's stats atomically
        if (updatedSession && updatedSession.durationSeconds) {
          await tx.update(users)
            .set({ 
              totalCrownTime: sql`${users.totalCrownTime} + ${updatedSession.durationSeconds}`,
              updatedAt: sql`CURRENT_TIMESTAMP`
            })
            .where(eq(users.id, prevSession.userId));
        }
      }
      
      // Double-check no active session exists after ending previous
      const [stillActive] = await tx
        .select()
        .from(crownSessions)
        .where(isNull(crownSessions.endedAt))
        .limit(1);
      
      if (stillActive) {
        throw new Error('Race condition detected: active session still exists');
      }
      
      // Start new session
      const [newSession] = await tx
        .insert(crownSessions)
        .values({ userId: toUserId })
        .returning();
      
      return newSession;
    });
  }

  async endCrownSession(sessionId: string, tokensEarned: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Acquire advisory lock for consistency
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${CROWN_GAME_LOCK_ID})`);
      
      // End session with server-side duration calculation, only if not already ended
      const [updatedSession] = await tx
        .update(crownSessions)
        .set({ 
          endedAt: sql`CURRENT_TIMESTAMP`,
          durationSeconds: sql`EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::int`,
          tokensEarned: tokensEarned.toString()
        })
        .where(and(
          eq(crownSessions.id, sessionId),
          isNull(crownSessions.endedAt) // Only end if not already ended
        ))
        .returning();
      
      // Update user stats atomically only if session was actually updated
      if (updatedSession && updatedSession.durationSeconds) {
        await tx.update(users)
          .set({ 
            totalCrownTime: sql`${users.totalCrownTime} + ${updatedSession.durationSeconds}`,
            totalTokensEarned: sql`${users.totalTokensEarned} + ${tokensEarned}::numeric`,
            updatedAt: sql`CURRENT_TIMESTAMP`
          })
          .where(eq(users.id, updatedSession.userId));
      }
    });
  }

  // Token earnings
  async recordTokenEarning(earning: InsertTokenEarning): Promise<TokenEarning> {
    const [result] = await db.insert(tokenEarnings).values(earning).returning();
    return result;
  }

  async getUserTokenEarnings(userId: string): Promise<TokenEarning[]> {
    return await db
      .select()
      .from(tokenEarnings)
      .where(eq(tokenEarnings.userId, userId))
      .orderBy(desc(tokenEarnings.earnedAt));
  }

  // Cooldowns
  async getUserCooldown(userId: string, type: string): Promise<UserCooldown | undefined> {
    const [cooldown] = await db
      .select()
      .from(userCooldowns)
      .where(and(
        eq(userCooldowns.userId, userId),
        eq(userCooldowns.type, type),
        lt(sql`CURRENT_TIMESTAMP`, userCooldowns.expiresAt)
      ))
      .orderBy(desc(userCooldowns.expiresAt))
      .limit(1);
    
    return cooldown || undefined;
  }

  async setCooldown(cooldown: InsertUserCooldown): Promise<UserCooldown> {
    // Use proper upsert with unique constraint handling
    const [result] = await db
      .insert(userCooldowns)
      .values(cooldown)
      .onConflictDoUpdate({
        target: [userCooldowns.userId, userCooldowns.type],
        set: {
          expiresAt: cooldown.expiresAt,
          createdAt: sql`CURRENT_TIMESTAMP`
        }
      })
      .returning();
    
    return result;
  }

  async clearExpiredCooldowns(): Promise<void> {
    await db
      .delete(userCooldowns)
      .where(lt(userCooldowns.expiresAt, sql`CURRENT_TIMESTAMP`));
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isVerified, true))
      .orderBy(desc(users.totalCrownTime))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
