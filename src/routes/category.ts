import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { auth, checkAdmin } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", auth, checkAdmin, createCategory);
router.put("/:id", auth, checkAdmin, updateCategory);
router.delete("/:id", auth, checkAdmin, deleteCategory);

export default router;
