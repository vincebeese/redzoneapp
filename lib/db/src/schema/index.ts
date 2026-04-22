import {
  pgTable,
  text,
  integer,
  serial,
  boolean,
  timestamp,
  numeric,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
  hasBetaAccess: boolean("has_beta_access").default(false),
  betaExpiresAt: timestamp("beta_expires_at", { withTimezone: true }),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  subscriptionEndsAt: timestamp("subscription_ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  passwordHash: text("password_hash"),
  displayName: text("display_name"),
  lastEventAt: timestamp("last_event_at", { withTimezone: true }),
  sessionBonus: integer("session_bonus").default(0).notNull(),
  sessionVersion: integer("session_version").default(1).notNull(),
});

export const modes = pgTable("modes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  systemPrompt: text("system_prompt").notNull(),
  maxTokens: integer("max_tokens").default(1200),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
  visibility: text("visibility").default("all"),
  icon: text("icon"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  company: text("company"),
  zone: text("zone"),
  dealValue: numeric("deal_value"),
  closeDate: date("close_date"),
  notes: text("notes"),
  status: text("status").default("active"),
  turnCount: integer("turn_count").default(0),
  reasoningThread: jsonb("reasoning_thread"),
  contextSummary: jsonb("context_summary"),
  lastCompressedAt: timestamp("last_compressed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  dealId: integer("deal_id"),
  modeSlug: text("mode_slug").notNull(),
  role: text("role"),
  content: text("content").notNull(),
  isCompressed: boolean("is_compressed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  artifactData: jsonb("artifact_data"),
  artifactType: text("artifact_type"),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  modeSlug: text("mode_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
  title: text("title"),
});

export const sessionMessages = pgTable("session_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id"),
  role: text("role"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const transcripts = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  dealId: integer("deal_id"),
  filename: text("filename").notNull(),
  content: text("content").notNull(),
  wordCount: integer("word_count"),
  analyzedAt: timestamp("analyzed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull(),
  hasBetaAccess: boolean("has_beta_access").default(false),
  invitedBy: text("invited_by"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  event: text("event").notNull(),
  properties: jsonb("properties"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const artifactTemplates = pgTable("artifact_templates", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  zone: text("zone"),
  builderSpec: jsonb("builder_spec"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const resourceCenterTools = pgTable("resource_center_tools", {
  id: serial("id").primaryKey(),
  code: text("code"),
  name: text("name").notNull(),
  description: text("description"),
  zone: text("zone"),
  url: text("url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const resourceCenterCategories = pgTable("resource_center_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const savedArtifacts = pgTable("saved_artifacts", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  dealId: integer("deal_id"),
  type: text("type").notNull(),
  name: text("name").notNull(),
  data: jsonb("data"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const apiSpendLog = pgTable("api_spend_log", {
  id: serial("id").primaryKey(),
  model: text("model"),
  tokensIn: integer("tokens_in"),
  tokensOut: integer("tokens_out"),
  estCost: numeric("est_cost"),
  userId: text("user_id"),
  modeSlug: text("mode_slug"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const trialNotifications = pgTable("trial_notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  notificationType: text("notification_type").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const sellerProfiles = pgTable("seller_profiles", {
  userId: text("user_id").primaryKey(),
  icp: text("icp"),
  avgDealSize: text("avg_deal_size"),
  salesCycle: text("sales_cycle"),
  winThemes: text("win_themes"),
  lossPatterns: text("loss_patterns"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const dealDocuments = pgTable("deal_documents", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull(),
  userId: text("user_id").notNull(),
  documentType: text("document_type").notNull(),
  originalFilename: text("original_filename").notNull(),
  sourceFormat: text("source_format").default("text"),
  rawText: text("raw_text"),
  wordCount: integer("word_count").default(0),
  analysis: jsonb("analysis"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});
