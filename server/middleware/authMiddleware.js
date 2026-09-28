const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  console.log("🔥 AUTH MIDDLEWARE CALLED");

  const authorization = req.headers.authorization;

  console.log(
    "AUTHORIZATION HEADER EXISTS:",
    !!authorization
  );

  if (
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    console.log("❌ NO BEARER TOKEN");

    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const token = authorization.slice(7);

  console.log(
    "TOKEN EXISTS:",
    !!token
  );

  console.log(
    "JWT SECRET EXISTS:",
    !!process.env.JWT_SECRET
  );

  console.log(
    "JWT SECRET LENGTH:",
    process.env.JWT_SECRET?.length
  );

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "✅ JWT VERIFIED:",
      decoded
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log(
      "❌ JWT ERROR:",
      error.message
    );

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;