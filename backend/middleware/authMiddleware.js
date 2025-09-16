import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Read the JWT from cookie (the login step set 'JWT')
  token = req.cookies?.JWT;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  try {
    // Decode will look like { userId: ... }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Load the user for downstream handlers; exclude password
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Admin guard
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(401);
  throw new Error("Not authorized as admin");
};
export { protect, admin };
