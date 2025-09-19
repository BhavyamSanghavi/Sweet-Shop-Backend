const express = require("express");
require("express-async-errors"); // makes async/await errors bubble to error handler
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// --- Global Middlewares ---
app.use(helmet());               // secure HTTP headers
app.use(cors());                 // enable CORS (restrict origins in prod!)
app.use(express.json());         // parse JSON bodies
app.use(morgan("combined"));     // HTTP request logging

// --- Routes ---
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// --- Error handler (last) ---
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
