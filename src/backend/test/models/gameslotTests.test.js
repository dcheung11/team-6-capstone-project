const mongoose = require("mongoose");
const GameSlot = require("../../models/GameSlot");
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

describe("GameSlot Model", () => {
  const date = new Date('2025-03-06T23:21:32.947Z');
  it("should create a game slot with required fields", () => {
    const gameSlot = new GameSlot({
      date: date,
      time: "5:30 PM",
      field: "Field 1",
    });

    expect(gameSlot.date).toBeInstanceOf(Date);
    expect(gameSlot.time).toBe("5:30 PM");
    expect(gameSlot.field).toBe("Field 1");
  });

  it("should allow game to be optional", () => {
    const gameSlot = new GameSlot({
      date: new Date(),
      time: "5:30 PM",
      field: "Field 1",
    });

    expect(gameSlot.game).toBeUndefined();
  });

  it("should enforce uniqueness of date, time, and field", async () => {
    const date = new Date('2025-03-06T23:21:32.947Z');
    const gameSlot1 = new GameSlot({
      date: date,
      time: "5:30 PM",
      field: "Field 1",
    });

    const gameSlot2 = new GameSlot({
      date: gameSlot1.date,
      time: gameSlot1.time,
      field: gameSlot1.field,
    });

    // Save the first game slot
    await gameSlot1.save();

    // Try saving the second game slot with the same date, time, and field
    await expect(gameSlot2.save()).rejects.toThrowError(
      "E11000 duplicate key error collection"
    );
  });
});
