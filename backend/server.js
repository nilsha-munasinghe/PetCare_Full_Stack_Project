const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// Test API
app.get("/", (req, res) => {
    res.send("Pet Care Backend is Running!");
});

// Authentication Routes
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});