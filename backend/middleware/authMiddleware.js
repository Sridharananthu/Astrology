import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Pandit from "../models/Pandit.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer"))
    return res.status(401).json({ message: "Not authorized, no token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ID + ROLE always available for all roles
    req.userId = decoded.id;
    req.role = decoded.role;

    // Load model by role
    if (decoded.role === "pandit") {
      req.pandit = await Pandit.findById(decoded.id).select("-password");
      if (!req.pandit)
        return res.status(404).json({ message: "Pandit not found" });
    }

    if (decoded.role === "user") {
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user)
        return res.status(404).json({ message: "User not found" });
    }

    if (decoded.role === "admin") {
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin)
        return res.status(404).json({ message: "Admin not found" });
    }

    return next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};



export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // save decoded info
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
