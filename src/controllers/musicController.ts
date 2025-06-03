import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Music } from "../models/Music";

// Get all music
const getAllMusic = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query: any = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search by name or artist if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
      ];
    }

    const music = await Music.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(music);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new music
const createMusic = async (req: Request, res: Response) => {
  try {
    // Get data from either JSON or form-data
    const name = req.body.name;
    const artist = req.body.artist;
    const categoryId = req.body.categoryId;
    const fileUrl = req.body.fileUrl || req.body.audio;
    const imageUrl = req.body.imageUrl || req.body.image;

    if (!name || !artist || !categoryId || !fileUrl || !imageUrl) {
      return res.status(400).json({
        message: "Missing required fields",
        required: {
          name: !name ? "Name is required" : null,
          artist: !artist ? "Artist is required" : null,
          categoryId: !categoryId ? "Category ID is required" : null,
          fileUrl: !fileUrl ? "Music file URL is required" : null,
          imageUrl: !imageUrl ? "Image URL is required" : null,
        },
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Create new music
    const music = new Music({
      name,
      artist,
      category: categoryId,
      fileUrl,
      imageUrl,
      duration: Math.round(0),
    });

    await music.save();

    res.status(201).json(music);
  } catch (error) {
    console.error("Create music error:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete music
const deleteMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    // Delete from database
    await music.deleteOne();

    res.json({ message: "Music deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { createMusic, deleteMusic, getAllMusic };
