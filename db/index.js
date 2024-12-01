import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Успешно подключились к базе данных!");
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error.message);
    process.exit(1);
  }
};

export default connectDB;
