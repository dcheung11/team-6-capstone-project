const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../../server"); // Adjust this based on your app entry point
const Player = require("../../models/player");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Player Controller", () => {
  let testPlayer;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("password123", 12);
    testPlayer = new Player({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: hashedPassword,
      waiverStatus: false,
      team: null,
      role: "player",
    });
    await testPlayer.save();
  });

  afterEach(async () => {
    // DO NOT UNCOMMENT THIS LINE, need to setup mongo menory server, or else our db will be wiped
    // await Player.deleteMany(); // Ensures test isolation
  });

  test("Signup - should create a new player", async () => {
    const response = await request(app).post("/api/players/signup").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "testpass",
      role: "player",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("playerId");
    expect(response.body).toHaveProperty("email", "jane@example.com");
    expect(response.body).toHaveProperty("token");
  });

  test("Login - should authenticate an existing player", async () => {
    const response = await request(app).post("/api/players/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("playerId");
    expect(response.body).toHaveProperty("token");
  });

  test("Login - should fail with invalid credentials", async () => {
    const response = await request(app).post("/api/players/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid credentials, could not log you in."
    );
  });
});
