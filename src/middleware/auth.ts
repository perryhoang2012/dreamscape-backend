import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Token } from "../models/Token";

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key_here"
    );

    // Check if token exists in database
    const tokenRecord = await Token.findOne({ token });
    if (!tokenRecord) {
      throw new Error();
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      await Token.deleteOne({ _id: tokenRecord._id });
      throw new Error();
    }

    const user = await User.findOne({ _id: (decoded as any)._id });
    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

export const checkPremium = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please authenticate" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isPremium) {
      return res.status(403).json({ message: "Premium subscription required" });
    }

    if (user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      user.isPremium = false;
      await user.save();
      return res.status(403).json({ message: "Premium subscription expired" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please authenticate" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
