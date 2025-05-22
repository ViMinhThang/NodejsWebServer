import asyncHandler from "../middleware/asyncHandler.js";

const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
});

export default logout;
