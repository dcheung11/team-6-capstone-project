const request = require("supertest");
const { app, server } = require("../../server"); // Adjust based on your project structure
const mongoose = require("mongoose");
const Team = require("../../models/Team");
const Player = require("../../models/Player");
const Season = require("../../models/Season");
const Division = require("../../models/Division");

describe("Prevent multiple teams per captain", () => {
  let captainId;
  let seasonId;
  let divisionId;
  let captainToken;

  beforeAll(async () => {
    // Create Season
    const season = await Season.create({
      name: "Summer 2025",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
    });
    seasonId = season._id;

    // Create Division
    const division = await Division.create({ name: "Division A", seasonId });
    divisionId = division._id;

    // Create a Captain
    const captain = await Player.create({
      firstName: "John",
      lastName: "Doe",
      email: "captain@example.com",
      password: "password123",
      role: "captain",
    });
    captainId = captain._id;

    captainToken = "mocked-token"; // Replace if actual authentication is used

    // Create First Team
    await Team.create({
      name: "First Team",
      divisionId,
      seasonId,
      captainId,
    });
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    Season.deleteOne({ _id: seasonId });
    // make sure we are running on test db
    // DO NOT UNCOMMENT these LINEs, need to setup mongo menory server, or else our db will be wiped
    // await Team.deleteMany({});
    // await Player.deleteMany({});
    // await Season.deleteMany({});
    // await Division.deleteMany({});
    await mongoose.connection.close();
  });

  test("should prevent captain from creating multiple teams in the same season", async () => {
    const res = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${captainToken}`)
      .send({
        name: "Second Team",
        divisionId,
        seasonId,
        captainId,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(
      /Captains can only manage one team per season/i
    );
  });
});


describe("Prevent duplicate team names", () => {
  let captainId;
  let seasonId;
  let divisionId;
  let captainToken;

  beforeAll(async () => {
    // Create Season
    const season = await Season.create({
      name: "Summer 2025",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
    });
    seasonId = season._id;

    // Create Division
    const division = await Division.create({ name: "Division A", seasonId });
    divisionId = division._id;

    // Create a Captain
    const captain = await Player.create({
      firstName: "John",
      lastName: "Doe",
      email: "captain@example.com",
      password: "password123",
      role: "captain",
    });
    captainId = captain._id;

    captainToken = "mocked-token"; // Replace if actual authentication is used

    // Create First Team
    await Team.create({
      name: "Duplicate Team",
      divisionId,
      seasonId,
      captainId,
    });
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    Season.deleteOne({ _id: seasonId });
    await mongoose.connection.close();
  });

  test("should prevent creating a team with a duplicate name", async () => {
    const res = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${captainToken}`)
      .send({
        name: "Duplicate Team", // Attempting to use the same name
        divisionId,
        seasonId,
        captainId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Team name already exists/i);
  });
});

describe("Prevent duplicate team names", () => {
  let seasonId;
  let divisionId;
  let existingTeamName = "Duplicate Team";

  beforeAll(async () => {
    // Create Season
    const season = await Season.create({
      name: "Summer 2025",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
    });
    seasonId = season._id;

    // Create Division
    const division = await Division.create({ name: "Division A", seasonId });
    divisionId = division._id;

    // Create a team with an existing name
    await Team.create({
      name: existingTeamName,
      divisionId,
      seasonId,
      captainId: new mongoose.Types.ObjectId(), // Mock captain
    });
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
  });

  test("should prevent creation of a team with a duplicate name", async () => {
    const res = await request(app)
      .post("/api/teams")
      .send({
        name: existingTeamName,
        divisionId,
        seasonId,
        captainId: new mongoose.Types.ObjectId(), // Different captain
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Team name already exists/i);
  });
});