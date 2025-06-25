import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use("/api/products", productRoutes);

//error handling middleware after route handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
