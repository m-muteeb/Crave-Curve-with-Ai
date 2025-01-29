require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Ensure secure URLs are used
});

// Log Cloudinary config to verify it's loaded correctly
console.log("Active Cloudinary Config:", cloudinary.config());

/**
 * Upload a file to Cloudinary
 * @param {string} localFilePath - The path to the local file to upload
 * @returns {object|null} - The response from Cloudinary or null on failure
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) throw new Error("Local file path is missing.");

        // Ensure the file exists
        if (!fs.existsSync(localFilePath)) {
            throw new Error(`File not found at ${localFilePath}`);
        }

        // Format the file path to be compatible with all systems
        const formattedPath = path.resolve(localFilePath).replace(/\\/g, '/');
        console.log("Uploading file from:", formattedPath);

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(formattedPath, {
            resource_type: "auto", // Automatically determine the file type
        });

        console.log("Uploaded to Cloudinary:", response.secure_url);

        // Remove the file after successful upload
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);

        // Safely handle file cleanup in case of errors
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null; // Indicate failure
    }
};

module.exports = { uploadOnCloudinary };
