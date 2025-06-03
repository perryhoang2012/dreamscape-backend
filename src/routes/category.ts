import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { auth, checkAdmin } from "../middleware/auth";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", auth, checkAdmin, upload.none(), createCategory);
router.put("/:id", auth, checkAdmin, upload.none(), updateCategory);
router.delete("/:id", auth, checkAdmin, deleteCategory);

export default router;
