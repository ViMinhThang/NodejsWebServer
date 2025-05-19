import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
const getUser = asyncHandler(async (req, res, next) => {
  res.json({ message: `Hello ${req.user.full_name}`, user: req.user });
});

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ full_name: req.body.name });
  if (user) {
    user.full_name = req.body.name;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
export { getUser, updateUserProfile };
