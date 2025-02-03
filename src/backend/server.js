require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const playersRoutes = require("./routes/players-routes");
const teamsRoutes = require("./routes/teams-routes");
const seasonRoutes = require("./routes/season-routes");
const announcementRoutes = require("./routes/announcements-routes");

const HttpError = require("./models/http-error");

const app = express();

// Enable CORS for all origins
app.use(cors());

app.use(bodyParser.json());

app.use("/api/players", playersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/season", seasonRoutes);
app.use("/api/announcements", announcementRoutes);

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
