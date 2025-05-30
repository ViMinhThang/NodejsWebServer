import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      console.log(1)
      next();
    } catch (error) {
      res.status(401);
      throw new Error(`Not authorize, token failed`);
    }
  } else {
    res.status(401);
    throw new Error(`Not authorize, no token`);
  }
});
export { protect };
