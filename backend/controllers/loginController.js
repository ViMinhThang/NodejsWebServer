import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../util/generateToken.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.full_name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("Invalid email or password");
  }
});

export { login };
