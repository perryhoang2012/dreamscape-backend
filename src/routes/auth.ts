import express from "express";
import {
  register,
  login,
  getProfile,
  createFirstAdmin,
} from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/create-first-admin", createFirstAdmin);

// Protected routes
router.get("/profile", auth, getProfile);

export default router;
