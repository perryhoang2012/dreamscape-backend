import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { Token } from "../models/Token";
import mongoose from "mongoose";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

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
    }) as IUser;

    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: (user._id as mongoose.Types.ObjectId).toString() },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    // Create token record
    const tokenRecord = new Token({
      userId: user._id,
      token,
      deviceId: req.headers["user-agent"] || "unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await tokenRecord.save();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPremium: user.isPremium,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const deviceId = req.headers["user-agent"] || "unknown";

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check existing tokens for regular users
    if (user.role === "user") {
      const existingToken = await Token.findOne({ userId: user._id });
      if (existingToken) {
        // Delete old token
        await Token.deleteOne({ _id: existingToken._id });
      }
    }

    // Generate token
    const token = jwt.sign(
      { _id: (user._id as mongoose.Types.ObjectId).toString() },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    // Create token record
    const tokenRecord = new Token({
      userId: user._id,
      token,
      deviceId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await tokenRecord.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPremium: user.isPremium,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      await Token.deleteOne({ token });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createFirstAdmin = async (req: Request, res: Response) => {
  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin account already exists" });
    }

    // Create admin account
    const admin = new User({
      email: "admin@dreamscape.com",
      password: "hoanghuynh2012",
      name: "Admin",
      phone: "0000000000",
      role: "admin",
      isPremium: true,
    }) as IUser;

    await admin.save();

    // Generate token
    const token = jwt.sign(
      { _id: (admin._id as mongoose.Types.ObjectId).toString() },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    // Create token record
    const tokenRecord = new Token({
      userId: admin._id,
      token,
      deviceId: req.headers["user-agent"] || "unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await tokenRecord.save();

    res.status(201).json({
      message: "First admin account created successfully",
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isPremium: admin.isPremium,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login, logout, getProfile, createFirstAdmin };
