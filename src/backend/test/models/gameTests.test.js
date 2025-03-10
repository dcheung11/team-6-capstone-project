const mongoose = require("mongoose");
const Game = require("../../models/Game");
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

describe("Game Model", () => {
  it("should create a game with required fields", () => {
    const game = new Game({
      date: new Date(),
      time: "5:30 PM",
      field: "Field 1",
      homeTeam: new mongoose.Types.ObjectId(),
      awayTeam: new mongoose.Types.ObjectId(),
      gameslot: new mongoose.Types.ObjectId(),
      division: new mongoose.Types.ObjectId(),
    });

    expect(game.date).toBeInstanceOf(Date);
    expect(game.time).toBe("5:30 PM");
    expect(game.field).toBe("Field 1");
  });

  it("should default homeScore and awayScore to null", () => {
    const game = new Game({
      date: new Date(),
      time: "5:30 PM",
      field: "Field 1",
      homeTeam: new mongoose.Types.ObjectId(),
      awayTeam: new mongoose.Types.ObjectId(),
      gameslot: new mongoose.Types.ObjectId(),
      division: new mongoose.Types.ObjectId(),
    });

    expect(game.homeScore).toBeNull();
    expect(game.awayScore).toBeNull();
  });
});
