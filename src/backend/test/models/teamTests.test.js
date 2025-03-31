// Author: Damien Cheung
// Description: Unit tests for the Teams model
// Last Modified: 2025-03-21

const mongoose = require("mongoose");
const Team = require("../../models/Team");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


describe("Team Model", () => {
  it("should create a team with required fields", () => {
    const team = new Team({
      name: "Warriors",
      divisionId: new mongoose.Types.ObjectId(), // Ensure using 'new'
      captainId: new mongoose.Types.ObjectId(),  // Ensure using 'new'
      seasonId: new mongoose.Types.ObjectId(),   // Ensure using 'new'
    });
    
    expect(team.name).toBe("Warriors");
    expect(team.divisionId).toBeDefined();
    expect(team.captainId).toBeDefined();
    expect(team.seasonId).toBeDefined();
  });

  it("should default wins, losses, and draws to 0", () => {
    const team = new Team({
      name: "Warriors",
      divisionId: new mongoose.Types.ObjectId(),
      captainId: new mongoose.Types.ObjectId(),
      seasonId: new mongoose.Types.ObjectId(),
    });
    expect(team.wins).toBe(0);
    expect(team.losses).toBe(0);
    expect(team.draws).toBe(0);
  });

  it("should set preferredTimes to 'Balanced' by default", () => {
    const team = new Team({
      name: "Warriors",
      divisionId: new mongoose.Types.ObjectId(),
      captainId: new mongoose.Types.ObjectId(),
      seasonId: new mongoose.Types.ObjectId(),
    });
    expect(team.preferredTimes).toBe("Balanced");
  });

  it("should throw an error for invalid preferredTimes", async () => {
    const team = new Team({
      name: "Warriors",
      divisionId: new mongoose.Types.ObjectId(),
      captainId: new mongoose.Types.ObjectId(),
      seasonId: new mongoose.Types.ObjectId(),
      preferredTimes: "Invalid Time", // Invalid value
    });

    await expect(team.validate()).rejects.toThrowError("preferredTimes");
  });

  it("should accept empty blacklistDays", async () => {
    const team = new Team({
      name: "Warriors",
      divisionId: new mongoose.Types.ObjectId(),
      captainId: new mongoose.Types.ObjectId(),
      seasonId: new mongoose.Types.ObjectId(),
      blacklistDays: [],
    });

    await expect(team.validate()).resolves.not.toThrow();
  });

  it("should throw an error for invalid blacklistDays value", async () => {
    const team = new Team({
      name: "Warriors",
      divisionId: new mongoose.Types.ObjectId(),
      captainId: new mongoose.Types.ObjectId(),
      seasonId: new mongoose.Types.ObjectId(),
      blacklistDays: ["Funday"], // Invalid value
    });

    await expect(team.validate()).rejects.toThrowError("blacklistDays");
  });
});