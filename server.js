const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // To allow requests from the frontend

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Resto", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// User Model
const User = mongoose.model("User", userSchema);

// Register API
app.post("/api/users/register", async (req, res) => {
    const { customerId, username, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            customerId,
            username,
            email,
            password: hashedPassword,
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Login API
app.post("/api/users/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
