// Author: Damien Cheung
// Description: Unit tests for the Seasons model
// Last Modified: 2025-03-21

const mongoose = require("mongoose");
const Season = require("../../models/Season");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Set up MongoMemoryServer for an in-memory database before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Season Model", () => {
  it("should create a season with required fields", () => {
    const season = new Season({
      name: "Summer 2025",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      allowedDivisions: 4,
      divisions: [new mongoose.Types.ObjectId()],
      status: "upcoming",
    });

    expect(season.name).toBe("Summer 2025");
    expect(season.startDate).toEqual(new Date("2025-06-01"));
    expect(season.endDate).toEqual(new Date("2025-08-31"));
    expect(season.allowedDivisions).toBe(4);
    expect(season.status).toBe("upcoming");
  });

  it("should default allowedDivisions to 4", () => {
    const season = new Season({
      name: "Summer 2025",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      divisions: [new mongoose.Types.ObjectId()],
    });

    expect(season.allowedDivisions).toBe(4);
  });

  it("should default status to 'upcoming'", () => {
    const season = new Season({
      name: "Summer 2025",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      divisions: [new mongoose.Types.ObjectId()],
    });

    expect(season.status).toBe("upcoming");
  });

  it("should throw an error for invalid status", async () => {
    const season = new Season({
      name: "Summer 2025",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      allowedDivisions: 4,
      divisions: [new mongoose.Types.ObjectId()],
      status: "invalid_status", // Invalid status
    });

    await expect(season.validate()).rejects.toThrowError("status");
  });


  it("should accept empty divisions array", async () => {
    const season = new Season({
      name: "Summer 2025",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      allowedDivisions: 4,
      divisions: [],
    });

    await expect(season.validate()).resolves.not.toThrow();
  });
});
