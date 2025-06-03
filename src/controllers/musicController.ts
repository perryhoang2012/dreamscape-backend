import { Request, Response } from "express";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { Category } from "../models/Category";
import { Music } from "../models/Music";
import cloudinary from "../config/cloudinary";

// Create new music
const createMusic = async (req: Request, res: Response) => {
  try {
    const { name, artist, categoryId } = req.body;
    const audioFile = req.file; // Cloudinary file info
    const imageFile = req.file; // Cloudinary file info

    if (!audioFile) {
      return res.status(400).json({ message: "Music file is required" });
    }

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      // Delete uploaded files from Cloudinary if category doesn't exist
      if (audioFile.path) await cloudinary.uploader.destroy(audioFile.filename);
      if (imageFile.path) await cloudinary.uploader.destroy(imageFile.filename);
      return res.status(404).json({ message: "Category not found" });
    }

    // Calculate duration from Cloudinary URL
    const duration = await getAudioDurationInSeconds(audioFile.path);

    // Create new music
    const music = new Music({
      name,
      artist,
      category: categoryId,
      fileUrl: audioFile.path,
      imageUrl: imageFile.path,
      duration: Math.round(duration),
    });

    await music.save();

    res.status(201).json(music);
  } catch (error) {
    console.log(error);
    // Delete uploaded files from Cloudinary if there's an error
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get all music
const getAllMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.find().populate("category");
    res.json(music);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete music
const deleteMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    // Delete files from Cloudinary
    if (music.fileUrl) {
      const publicId = music.fileUrl.split("/").pop()?.split(".")[0];
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
    if (music.imageUrl) {
      const publicId = music.imageUrl.split("/").pop()?.split(".")[0];
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // Delete from database
    await music.deleteOne();

    res.json({ message: "Music deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { createMusic, getAllMusic, deleteMusic };
