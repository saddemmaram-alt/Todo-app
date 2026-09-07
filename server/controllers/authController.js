const authService =
  require("../services/authService");

async function register(req, res, next) {
  try {
    const user =
      await authService.registerUser(
        req.body
      );

    res.status(201).json(user);
  } catch (error) {
    if (
      error.message ===
      "Email already registered"
    ) {
      return res.status(409).json({
        error: error.message,
      });
    }

    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result =
      await authService.loginUser(
        req.body
      );

    res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "Invalid email or password"
    ) {
      return res.status(401).json({
        error: error.message,
      });
    }

    next(error);
  }
}

module.exports = {
  register,
  login,
};