const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); // You'll need to modify server.js to export the app

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("URL Shortener API", () => {
  let token;
  let shortId;

  // Test user registration
  test("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  // Test URL shortening
  test("should create a short URL", async () => {
    const res = await request(app)
      .post("/api/url/shorten")
      .set("Authorization", `Bearer ${token}`)
      .send({
        originalUrl: "https://www.example.com",
        customAlias: "test123",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("shortId");
    shortId = res.body.shortId;
  });

  // Test URL redirect
  test("should redirect to original URL", async () => {
    const res = await request(app).get(`/api/url/${shortId}`);
    expect(res.statusCode).toBe(302);
  });
});
