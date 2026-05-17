import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { createSsrHandler } from "./ssr/index.js";
import authRouter from "./routes/auth.js";
import modesRouter from "./routes/modes.js";
import dealsRouter from "./routes/deals.js";
import chatRouter from "./routes/chat.js";
import sessionsRouter from "./routes/sessions.js";
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";
import stripeRouter from "./routes/stripe.js";
import transcriptsRouter from "./routes/transcripts.js";
import artifactsRouter from "./routes/artifacts.js";
import documentsRouter from "./routes/documents.js";
import resourceCenterRouter from "./routes/resourceCenter.js";
import analyticsRouter from "./routes/analytics.js";
import hubspotRouter from "./routes/hubspot.js";
import blogRouter from "./routes/blog.js";
import { startTrialChecker } from "./services/trialChecker.js";
import { startBackupScheduler } from "./services/backupService.js";
import { runSchemaCheck } from "./db/schemaCheck.js";
import { runMigrations } from "./db/migrate.js";

const app: Express = express();

// Required for express-rate-limit to correctly identify IPs behind Replit's proxy
app.set("trust proxy", 1);

// Rate limiter for sensitive auth endpoints (login, magic-link, forgot/reset password)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
  skipSuccessfulRequests: false,
});

// Rate limiter for the public seat-count endpoint (unauthenticated, makes live Stripe calls)
const seatCountRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
  skipSuccessfulRequests: false,
});

// Rate limiter for transcript uploads — limits in-memory buffering and AI quota abuse
const transcriptUploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many transcript uploads. Please wait before trying again." },
  skipSuccessfulRequests: false,
});

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SSR shell routes for public marketing pages — registered before any
// static file-serving or SPA catch-all middleware so page-specific
// meta tags, canonical URLs, and JSON-LD schemas are injected for crawlers.
// The homepage (/) is served by the frontend's static index.html which
// already contains correct homepage meta; only inner public pages need SSR.
app.get("/about", createSsrHandler("/about"));
app.get("/services", createSsrHandler("/services"));
app.get("/blog", createSsrHandler("/blog"));
app.get("/what-is-red-zone-selling", createSsrHandler("/what-is-red-zone-selling"));
app.get("/who-is-vince-beese", createSsrHandler("/who-is-vince-beese"));
app.get("/what-is-a-sales-strength-coach", createSsrHandler("/what-is-a-sales-strength-coach"));
app.get("/rzs-ai-coach", createSsrHandler("/rzs-ai-coach"));
app.get("/faq", createSsrHandler("/faq"));

app.get(["/api/health", "/api/healthz"], (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/auth/login", authRateLimiter);
app.post("/api/auth/magic-link/request", authRateLimiter);
app.post("/api/auth/forgot-password", authRateLimiter);
app.post("/api/auth/reset-password", authRateLimiter);
app.use("/api/auth", authRouter);
app.get("/api/stripe/seat-count", seatCountRateLimiter);
app.use("/api/modes", modesRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stripe", stripeRouter);
app.post("/api/transcripts", transcriptUploadRateLimiter);
app.use("/api/transcripts", transcriptsRouter);
app.use("/api/artifacts", artifactsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/resource-center", resourceCenterRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/hubspot", hubspotRouter);
app.use("/api/blog", blogRouter);

app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  res.status((err as { status?: number }).status || 500).json({
    error: err.message || "Internal server error",
  });
});

runMigrations().catch(err => console.error('Startup migration error:', err));
startTrialChecker();
startBackupScheduler();
runSchemaCheck();

export default app;
