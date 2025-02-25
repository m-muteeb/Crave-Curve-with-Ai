const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./route/Router");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());


console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS configuration to allow the frontend from multiple origins
app.use(cors({
    origin: [
        "http://172.16.50.211:5000",  // Your mobile device IP address (if using mobile)
        "http://localhost:5000",       // For local frontend testing
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Allow cookies and authorization headers
}));

// Example GET request
app.get("/", (req, res) => {
    res.send("hello welcome to api");
});

// Register API routes
app.use("/api", routes);  // Ensure routes are correctly exported and handled

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});