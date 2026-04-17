const express = require("express");
const morgan = require("morgan");
const passportRoutes = require("./routes/passportRoutes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "data-access-service" });
});

app.use("/api/passports", passportRoutes);

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
});

module.exports = app;

