import express from "express";
import {
  register,
  login,
  getProfile,
  createFirstAdmin,
} from "../controllers/authController";
import { auth } from "../middleware/auth";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Public routes
router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);
router.post("/create-first-admin", upload.none(), createFirstAdmin);

// Protected routes
router.get("/profile", auth, getProfile);

export default router;
