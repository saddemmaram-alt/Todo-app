const jwt = require("jsonwebtoken");

const authMiddleware =
  require("./authMiddleware");

describe("Auth Middleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET =
      "test-secret-for-jwt";
  });

  function createResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }

  test("allows request with valid token", () => {
    const token = jwt.sign(
      {
        userId: 1,
        email: "test@example.com",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(req.user).toEqual({
      userId: 1,
      email: "test@example.com",
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  test("rejects missing authorization header", () => {
    const req = {
      headers: {},
    };

    const res = createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(
      401
    );

    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication required",
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("rejects malformed authorization header", () => {
    const req = {
      headers: {
        authorization: "Basic abc123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(
      401
    );

    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication required",
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("rejects invalid token", () => {
    const req = {
      headers: {
        authorization:
          "Bearer invalid-token",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(
      401
    );

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("rejects expired token", () => {
    const token = jwt.sign(
      {
        userId: 1,
        email: "test@example.com",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "-1s",
      }
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(
      401
    );

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });

    expect(next).not.toHaveBeenCalled();
  });
});