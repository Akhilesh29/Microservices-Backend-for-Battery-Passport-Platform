const express = require("express");
const morgan = require("morgan");
const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "document-service" });
});

app.use("/api/documents", documentRoutes);

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
});

module.exports = app;

