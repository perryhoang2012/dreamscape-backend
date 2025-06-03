import express from "express";
import {
  createMusic,
  getAllMusic,
  deleteMusic,
} from "../controllers/musicController";
import { uploadAudio, uploadImage } from "../config/cloudinary";

const router = express.Router();

// Get all music
router.get("/", getAllMusic);

// Create new music
router.post(
  "/",
  uploadAudio.single("audio"),
  uploadImage.single("image"),
  createMusic
);

// Delete music
router.delete("/:id", deleteMusic);

export default router;
