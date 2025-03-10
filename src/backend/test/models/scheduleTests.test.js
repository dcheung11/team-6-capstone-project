const mongoose = require("mongoose");
const Schedule = require("../../models/Schedule");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Schedule Model", () => {
  it("should create a schedule with required fields", () => {
    const schedule = new Schedule({
      seasonId: new mongoose.Types.ObjectId(),
      gameSlots: [new mongoose.Types.ObjectId()],
      games: [new mongoose.Types.ObjectId()],
    });

    expect(schedule.seasonId).toBeDefined();
    expect(schedule.gameSlots.length).toBeGreaterThan(0);
    expect(schedule.games.length).toBeGreaterThan(0);
  });

  it("should have timestamps createdAt and updatedAt", () => {
    const schedule = new Schedule({
      seasonId: new mongoose.Types.ObjectId(),
      gameSlots: [new mongoose.Types.ObjectId()],
      games: [new mongoose.Types.ObjectId()],
    });

    expect(schedule.createdAt).toBeDefined();
    expect(schedule.updatedAt).toBeDefined();
  });
});
