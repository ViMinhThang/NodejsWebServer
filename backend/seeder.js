import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";
import users from "./data/data.js";
dotenv.config();

connectDB();
const importData = async () => {
  try {
    await User.deleteMany();
    const createdUser = await User.insertMany(users);
    console.log(`Data imported!`);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log("Data destroyed!");
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
