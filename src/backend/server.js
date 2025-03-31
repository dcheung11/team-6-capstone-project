// Author: Damien Cheung
// Description: This file sets up the Express server, connects to the MongoDB database,
// and defines the API routes for the application. It also includes error handling and
// middleware for parsing incoming requests. The server listens on a specified port and
// runs a scheduled job to update season statuses.
// Last Modified: 2025-03-30

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Importing routes
const playersRoutes = require("./routes/players-routes");
const teamsRoutes = require("./routes/teams-routes");
const seasonRoutes = require("./routes/season-routes");
const announcementRoutes = require("./routes/announcements-routes");
const scheduleRoutes = require("./routes/schedule-routes");
const divisionRoutes = require("./routes/divisions-routes");
const gamesRoutes = require("./routes/games-route");
const rescheduleRoutes = require("./routes/reschedule-routes");
const notificationRoutes = require("./routes/notification-routes");
const standingsRoutes = require("./routes/standings-routes");

const HttpError = require("./models/http-error");

// server.js is the main entry point for the server application.
// It initializes the Express application, sets up middleware, and defines routes.
// It also connects to the MongoDB database and starts the server on a specified port.
const app = express();

const cron = require("node-cron");
const updateSeasonStatuses = require("./scripts/updateSeasonStatuses");

// Automated job to update season statuses if a season starts or ends
// Run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running season update job...");
  updateSeasonStatuses();
});

// Enable CORS for all origins
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Access the routes
app.use("/api/players", playersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/reschedule-requests", rescheduleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/standings", standingsRoutes);

// Handle unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
