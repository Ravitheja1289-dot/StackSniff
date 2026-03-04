require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const scanRoute = require("./routes/scan");

const app = express();
const PORT = process.env.PORT || 3001;

// --------------- Middleware ---------------

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST"],
  })
);

// JSON body parsing
app.use(express.json());

// Rate limiting — 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "rate_limit",
    message: "Too many requests — please try again in a minute",
  },
});
app.use("/api/", limiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} — ${ms}ms`);
  });
  next();
});

// --------------- Routes ---------------

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Scan endpoint
app.use("/api/scan", scanRoute);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "not_found",
    message: "Endpoint not found",
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "internal_error",
    message: "An unexpected error occurred",
  });
});

// --------------- Start ---------------

app.listen(PORT, () => {
  console.log(`StackSniff backend running on http://localhost:${PORT}`);
});
