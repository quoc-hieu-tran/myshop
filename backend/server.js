import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p._id === id);
  res.json(product);
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
