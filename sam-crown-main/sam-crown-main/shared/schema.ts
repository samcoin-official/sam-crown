import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, decimal, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").unique(), // Make unique for getUserByUsername safety
  password: text("password"),
  profilePictureUrl: text("profile_picture_url"), // Added this field
  // World ID verification fields
  worldIdNullifier: text("world_id_nullifier").unique(), // Unique per verified human
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  // Game stats
  totalCrownTime: integer("total_crown_time").default(0), // Total seconds holding crown
  totalTokensEarned: decimal("total_tokens_earned", { precision: 10, scale: 2 }).default("0"),
  // Timestamps
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  nullifierIdx: index("idx_world_id_nullifier").on(table.worldIdNullifier),
  verifiedIdx: index("idx_is_verified").on(table.isVerified),
  crownTimeIdx: index("idx_total_crown_time").on(table.totalCrownTime),
}));

// Crown sessions track who currently holds the crown
export const crownSessions = pgTable("crown_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  startedAt: timestamp("started_at").default(sql`CURRENT_TIMESTAMP`),
  endedAt: timestamp("ended_at"), // null means currently active
  durationSeconds: integer("duration_seconds"), // Calculated when session ends
  tokensEarned: decimal("tokens_earned", { precision: 10, scale: 2 }).default("0"),
}, (table) => ({
  userIdx: index("idx_crown_user").on(table.userId),
  activeIdx: index("idx_crown_active").on(table.endedAt), // null = active session
  startedIdx: index("idx_crown_started").on(table.startedAt),
  // Single active session enforced via advisory locks in application
}));

// Token earnings track real-time token accrual
export const tokenEarnings = pgTable("token_earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  crownSessionId: varchar("crown_session_id").notNull().references(() => crownSessions.id),
  tokensEarned: decimal("tokens_earned", { precision: 10, scale: 2 }).notNull(),
  earnedAt: timestamp("earned_at").default(sql`CURRENT_TIMESTAMP`),
  ratePerSecond: decimal("rate_per_second", { precision: 10, scale: 4 }).notNull(),
}, (table) => ({
  userIdx: index("idx_earnings_user").on(table.userId),
  sessionIdx: index("idx_earnings_session").on(table.crownSessionId),
  earnedIdx: index("idx_earnings_date").on(table.earnedAt),
}));

// User cooldowns track steal attempt restrictions
export const userCooldowns = pgTable("user_cooldowns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'steal_crown'
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  // Enforce unique cooldown per user per type
  uniqueUserType: uniqueIndex("uniq_cooldown_user_type").on(table.userId, table.type),
  expiresIdx: index("idx_cooldown_expires").on(table.expiresAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  crownSessions: many(crownSessions),
  tokenEarnings: many(tokenEarnings),
  cooldowns: many(userCooldowns),
}));

export const crownSessionsRelations = relations(crownSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [crownSessions.userId],
    references: [users.id],
  }),
  tokenEarnings: many(tokenEarnings),
}));

export const tokenEarningsRelations = relations(tokenEarnings, ({ one }) => ({
  user: one(users, {
    fields: [tokenEarnings.userId],
    references: [users.id],
  }),
  crownSession: one(crownSessions, {
    fields: [tokenEarnings.crownSessionId],
    references: [crownSessions.id],
  }),
}));

export const userCooldownsRelations = relations(userCooldowns, ({ one }) => ({
  user: one(users, {
    fields: [userCooldowns.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  worldIdNullifier: true,
  profilePictureUrl: true, // Added this field to the schema
}).partial({ worldIdNullifier: true, profilePictureUrl: true }); // Make both optional

// Separate schema for World ID verification
export const verifyUserSchema = z.object({
  userId: z.string(),
  worldIdNullifier: z.string().min(1),
});

export const insertCrownSessionSchema = createInsertSchema(crownSessions).pick({
  userId: true,
});

export const insertTokenEarningSchema = createInsertSchema(tokenEarnings).pick({
  userId: true,
  crownSessionId: true,
  tokensEarned: true,
  ratePerSecond: true,
});

export const insertUserCooldownSchema = createInsertSchema(userCooldowns).pick({
  userId: true,
  type: true,
  expiresAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CrownSession = typeof crownSessions.$inferSelect;
export type InsertCrownSession = z.infer<typeof insertCrownSessionSchema>;
export type TokenEarning = typeof tokenEarnings.$inferSelect;
export type InsertTokenEarning = z.infer<typeof insertTokenEarningSchema>;
export type UserCooldown = typeof userCooldowns.$inferSelect;
export type InsertUserCooldown = z.infer<typeof insertUserCooldownSchema>;
export type VerifyUser = z.infer<typeof verifyUserSchema>;

// Token Configuration Schema
export const tokenConfigSchema = z.object({
  dailyTokenPool: z.number().int().positive().min(1).max(1000000),
  totalSupply: z.number().int().positive().min(1),
  campaignDays: z.number().int().positive().min(1).max(3650), // Max 10 years
  distributionWallet: z.string().min(1),
  tokensPerSecond: z.number().positive(),
});

export type TokenConfig = z.infer<typeof tokenConfigSchema>;

// Token configuration response schema for API
export const tokenConfigResponseSchema = z.object({
  success: z.boolean(),
  config: tokenConfigSchema.optional(),
  error: z.string().optional(),
});

export type TokenConfigResponse = z.infer<typeof tokenConfigResponseSchema>;