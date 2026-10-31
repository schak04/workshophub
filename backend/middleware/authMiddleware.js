const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized! No token provided!!" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "INVALID token!!" });
    req.user = user;
    req.isDemo = Boolean(payload.isDemo);

    if (req.isDemo && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return res.status(403).json({
        message: "Action disabled in demo mode to protect sample data.",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

const requireRole = (roles = []) => {
  if (typeof roles === "string") roles = [roles];
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
