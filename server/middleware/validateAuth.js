function validateRegister(req, res, next) {
    const { name, email, password } =
      req.body;
  
    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        error: "Name is required",
      });
    }
  
    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        error: "Email is required",
      });
    }
  
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }
  
    if (
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        error: "Password is required",
      });
    }
  
    if (password.length < 8) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters",
      });
    }
  
    next();
  }
  
  function validateLogin(req, res, next) {
    const { email, password } =
      req.body;
  
    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        error: "Email is required",
      });
    }
  
    if (
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        error: "Password is required",
      });
    }
  
    next();
  }
  
  module.exports = {
    validateRegister,
    validateLogin,
  };