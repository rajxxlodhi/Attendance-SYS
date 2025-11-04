import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const uploadOnCloudinary = async (imageData) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    if (!imageData) return null;

    // Direct base64 image upload (data URI)
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: "attendance/checkin_images",
      resource_type: "image",
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export default uploadOnCloudinary;