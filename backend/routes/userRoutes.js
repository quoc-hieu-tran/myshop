import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

// /api/users
router
  .route("/")
  .get(protect, admin, getUsers) //only Admin
  .post(registerUser); // Public
// /api/users/login
router.post("/auth", authUser); // Public
// /api/users/logout
router.post("/logout", protect, logoutUser); // Private (once auth added)
// /api/users/profile
router
  .route("/profile")
  .get(protect, getUserProfile) // Private
  .put(protect, updateUserProfile)
  .delete(protect, deleteUser); // Private
// /api/users/:id  (Admin)
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);
export default router;
