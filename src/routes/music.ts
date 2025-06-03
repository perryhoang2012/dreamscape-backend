import express from "express";
import {
  createMusic,
  getAllMusic,
  deleteMusic,
} from "../controllers/musicController";
import multer from "multer";

const router = express.Router();
const upload = multer(); // memory storage, không lưu file

// Get all music
router.get("/", getAllMusic);

// Create new music
router.post("/", upload.none(), createMusic);

// Delete music
router.delete("/:id", deleteMusic);

export default router;
