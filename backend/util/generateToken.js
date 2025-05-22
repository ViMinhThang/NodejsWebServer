import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    origin:"https://nodejs-web-server-five.vercel.app",
    secure: process.env.NODE_ENV==="production",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
