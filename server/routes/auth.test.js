require("../setupTests");

require("dotenv").config();

const request =
  require("supertest");

const app =
  require("../app");

const pool =
  require("../db");

describe("Auth API", () => {
  const testEmail =
    `auth-${Date.now()}@example.com`;

  afterAll(async () => {
    await pool.query(
      "DELETE FROM users WHERE email = $1",
      [testEmail]
    );

    await pool.end();
  });

  test("POST /auth/register creates a user", async () => {
    const response =
      await request(app)
        .post("/auth/register")
        .send({
          name: "Maram",
          email: testEmail,
          password: "Password123!",
        });

    expect(
      response.statusCode
    ).toBe(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: "Maram",
      email: testEmail,
    });
  });

  test("POST /auth/register rejects duplicate email", async () => {
    const response =
      await request(app)
        .post("/auth/register")
        .send({
          name: "Another User",
          email: testEmail,
          password: "Password123!",
        });

    expect(
      response.statusCode
    ).toBe(409);

    expect(
      response.body.error
    ).toBe(
      "Email already registered"
    );
  });

  test("POST /auth/register rejects invalid email", async () => {
    const response =
      await request(app)
        .post("/auth/register")
        .send({
          name: "Maram",
          email: "wrong-email",
          password: "Password123!",
        });

    expect(
      response.statusCode
    ).toBe(400);

    expect(
      response.body.error
    ).toBe("Invalid email");
  });

  test("POST /auth/register rejects short password", async () => {
    const response =
      await request(app)
        .post("/auth/register")
        .send({
          name: "Maram",
          email:
            "short-password@example.com",
          password: "123",
        });

    expect(
      response.statusCode
    ).toBe(400);

    expect(
      response.body.error
    ).toBe(
      "Password must be at least 8 characters"
    );
  });

  test("POST /auth/login returns JWT for valid credentials", async () => {
    const response =
      await request(app)
        .post("/auth/login")
        .send({
          email: testEmail,
          password: "Password123!",
        });

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.token
    ).toEqual(
      expect.any(String)
    );

    expect(response.body.user).toEqual({
      id: expect.any(Number),
      name: "Maram",
      email: testEmail,
    });
  });

  test("POST /auth/login rejects wrong password", async () => {
    const response =
      await request(app)
        .post("/auth/login")
        .send({
          email: testEmail,
          password: "WrongPassword!",
        });

    expect(
      response.statusCode
    ).toBe(401);

    expect(
      response.body.error
    ).toBe(
      "Invalid email or password"
    );
  });

  test("POST /auth/login rejects unknown email", async () => {
    const response =
      await request(app)
        .post("/auth/login")
        .send({
          email:
            "unknown-auth@example.com",
          password: "Password123!",
        });

    expect(
      response.statusCode
    ).toBe(401);

    expect(
      response.body.error
    ).toBe(
      "Invalid email or password"
    );
  });

  test("POST /auth/login accepts uppercase email", async () => {
    const response =
      await request(app)
        .post("/auth/login")
        .send({
          email:
            testEmail.toUpperCase(),
          password: "Password123!",
        });

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.token
    ).toEqual(
      expect.any(String)
    );
  });
});