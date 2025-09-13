import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
