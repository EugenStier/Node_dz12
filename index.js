import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Сервер работает! Добро пожаловать!");
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
