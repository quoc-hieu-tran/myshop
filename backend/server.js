import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

//error handling middleware after route handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
