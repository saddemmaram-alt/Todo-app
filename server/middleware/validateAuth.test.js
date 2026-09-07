const {
    validateRegister,
    validateLogin,
  } = require("./validateAuth");
  
  describe("Auth validation", () => {
    function createResponse() {
      return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    }
  
    test("accepts valid registration data", () => {
      const req = {
        body: {
          name: "Maram",
          email: "maram@example.com",
          password: "Password123!",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateRegister(req, res, next);
  
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
    test("rejects missing name", () => {
      const req = {
        body: {
          email: "maram@example.com",
          password: "Password123!",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateRegister(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Name is required",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test("rejects invalid email", () => {
      const req = {
        body: {
          name: "Maram",
          email: "wrong-email",
          password: "Password123!",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateRegister(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test("rejects short password", () => {
      const req = {
        body: {
          name: "Maram",
          email: "maram@example.com",
          password: "123",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateRegister(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Password must be at least 8 characters",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test("accepts valid login data", () => {
      const req = {
        body: {
          email: "maram@example.com",
          password: "Password123!",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateLogin(req, res, next);
  
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
    test("rejects login without email", () => {
      const req = {
        body: {
          password: "Password123!",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateLogin(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email is required",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test("rejects login without password", () => {
      const req = {
        body: {
          email: "maram@example.com",
        },
      };
  
      const res = createResponse();
      const next = jest.fn();
  
      validateLogin(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password is required",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });