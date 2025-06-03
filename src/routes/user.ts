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
import multer from "multer";

const router = express.Router();
const upload = multer();

// All routes require admin authentication
router.use(auth, checkAdmin);

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getUserById);

// Create new user
router.post("/", upload.none(), createUser);

// Update user
router.put("/:id", upload.none(), updateUser);

// Update user password
router.put("/:id/password", upload.none(), updateUserPassword);

// Delete user
router.delete("/:id", deleteUser);

export default router;
