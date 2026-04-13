import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
import { startTrialChecker } from "./services/trialChecker.js";

const app: Express = express();

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/modes", modesRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/transcripts", transcriptsRouter);
app.use("/api/artifacts", artifactsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/resource-center", resourceCenterRouter);
app.use("/api/analytics", analyticsRouter);

app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  res.status((err as { status?: number }).status || 500).json({
    error: err.message || "Internal server error",
  });
});

startTrialChecker();

export default app;
