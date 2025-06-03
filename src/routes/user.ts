import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../controllers/userController";
import { auth, checkAdmin } from "../middleware/auth";

const router = express.Router();

// All routes require admin authentication
router.use(auth, checkAdmin);

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getUserById);

// Create new user
router.post("/", createUser);

// Update user
router.put("/:id", updateUser);

// Update user password
router.put("/:id/password", updateUserPassword);

// Delete user
router.delete("/:id", deleteUser);

export default router;
