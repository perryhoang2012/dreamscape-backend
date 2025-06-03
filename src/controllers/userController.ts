import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

// Get all users (admin only)
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID (admin only)
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user (admin only)
const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role, isPremium } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      phone,
      role: role || "user",
      isPremium: isPremium || false,
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user (admin only)
const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, role, isPremium, premiumExpiresAt } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isPremium !== undefined) user.isPremium = isPremium;
    if (premiumExpiresAt) user.premiumExpiresAt = new Date(premiumExpiresAt);

    await user.save();

    // Return updated user without password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user password (admin only)
const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
