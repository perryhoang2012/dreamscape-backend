import mongoose, { Schema, Document } from "mongoose";

export interface IMusic extends Document {
  name: string;
  artist: string;
  category: mongoose.Types.ObjectId;
  fileUrl: string;
  imageUrl: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const MusicSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
MusicSchema.index({ name: "text", artist: "text" });
MusicSchema.index({ category: 1 });

export const Music = mongoose.model<IMusic>("Music", MusicSchema);
