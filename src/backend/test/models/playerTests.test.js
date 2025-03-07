const mongoose = require("mongoose");
const Player = require("../../models/Player");
const Team = require("../../models/Team");
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

describe("Player Model", () => {
  it("should create a player with required fields", () => {
    const player = new Player({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(player.firstName).toBe("John");
    expect(player.lastName).toBe("Doe");
    expect(player.email).toBe("john.doe@example.com");
    expect(player.password).toBe("password123");
  });

  it("should default gender to 'other'", () => {
    const player = new Player({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(player.gender).toBe("other");
  });

  it("should default waiverStatus to false", () => {
    const player = new Player({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(player.waiverStatus).toBe(false);
  });

  it("should throw an error for missing required fields", async () => {
    const player = new Player({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });

    await expect(player.validate()).rejects.toThrowError("password");
  });

  it("should throw an error for duplicate email", async () => {
    const player1 = new Player({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    await player1.save();

    const player2 = new Player({
      firstName: "Jane",
      lastName: "Doe",
      email: "john.doe@example.com", // Duplicate email
      password: "password456",
    });

    await expect(player2.save()).rejects.toThrowError("E11000 duplicate key error");
  });
});
