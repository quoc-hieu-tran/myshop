import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Order from "./models/orderModel.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import products from "./data/products.js";
import users from "./data/users.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();
const importData = async () => {
  try {
    //Delete existing data in Order, Product, and User collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    const createdUsers = await User.insertMany(users);
    const adminId = createdUsers[0]._id;
    const modifiedProducts = products.map((product) => ({ ...product, user: adminId })); //all the products in sample data now belong to admin
    await Product.insertMany(modifiedProducts);
    console.log("Data Imported");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "d") {
  destroyData();
} else {
  importData();
}
