const {
    TextEncoder,
    TextDecoder,
  } = require("util");
  
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  
  require("dotenv").config();
  
  const pool = require("../db");
  
  const {
    registerUser,
    loginUser,
  } = require("./authService");
  
  describe("Auth Service", () => {
    let registeredEmail;
  
    afterAll(async () => {
      if (registeredEmail) {
        await pool.query(
          "DELETE FROM users WHERE email = $1",
          [registeredEmail]
        );
      }
  
      await pool.end();
    });
  
    test("registers a new user", async () => {
      registeredEmail =
        `test-${Date.now()}@example.com`;
  
      const user =
        await registerUser({
          name: "Test User",
          email: registeredEmail,
          password: "Password123!",
        });
  
      expect(user).toEqual({
        id: expect.any(Number),
        name: "Test User",
        email: registeredEmail.toLowerCase(),
      });
    });
  
    test("does not store the plain password", async () => {
      const result = await pool.query(
        `
          SELECT password_hash
          FROM users
          WHERE email = $1
        `,
        [registeredEmail]
      );
  
      expect(
        result.rows[0].password_hash
      ).toBeDefined();
  
      expect(
        result.rows[0].password_hash
      ).not.toBe(
        "Password123!"
      );
    });
  
    test("does not allow duplicate email", async () => {
      await expect(
        registerUser({
          name: "Another User",
          email: registeredEmail,
          password: "Password123!",
        })
      ).rejects.toThrow(
        "Email already registered"
      );
    });
  
    test("logs in with valid credentials", async () => {
      const result =
        await loginUser({
          email: registeredEmail,
          password: "Password123!",
        });
  
      expect(result.token).toEqual(
        expect.any(String)
      );
  
      expect(result.user).toEqual({
        id: expect.any(Number),
        name: "Test User",
        email: registeredEmail.toLowerCase(),
      });
    });
  
    test("rejects invalid password", async () => {
      await expect(
        loginUser({
          email: registeredEmail,
          password: "WrongPassword123!",
        })
      ).rejects.toThrow(
        "Invalid email or password"
      );
    });
  
    test("rejects unknown email", async () => {
      await expect(
        loginUser({
          email: "unknown@example.com",
          password: "Password123!",
        })
      ).rejects.toThrow(
        "Invalid email or password"
      );
    });
  });