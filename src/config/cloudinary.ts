import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình storage cho hình ảnh
export const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dreamscape/images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  } as any,
});

// Cấu hình storage cho audio
export const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dreamscape/audio",
    resource_type: "video", // Cloudinary sử dụng resource_type 'video' cho audio
    allowed_formats: ["mp3", "wav", "ogg"],
    format: "mp3",
  } as any,
});

// Middleware upload hình ảnh
export const uploadImage = multer({ storage: imageStorage });

// Middleware upload audio
export const uploadAudio = multer({ storage: audioStorage });

export default cloudinary;
