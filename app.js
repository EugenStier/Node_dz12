import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Успешно подключились к базе данных!");
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error);
  }
}

connectDB();

const db = client.db("my_database");
const productsCollection = db.collection("products");

app.post("/products", async (req, res) => {
  try {
    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    };

    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    res
      .status(500)
      .json({ message: "Ошибка при создании продукта", error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    res.status(500).json({
      message: "Ошибка при получении продуктов",
      error: error.message,
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await productsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    res.json(product);
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении продукта", error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    };

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedProduct }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    res.json({ message: "Продукт обновлён" });
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    res.status(500).json({
      message: "Ошибка при обновлении продукта",
      error: error.message,
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    res
      .status(500)
      .json({ message: "Ошибка при удалении продукта", error: error.message });
  }
});

app.listen(3003, () => {
  console.log("Сервер запущен на http://localhost:3003");
});
