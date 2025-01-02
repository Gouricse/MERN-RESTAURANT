const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path as needed
const router = express.Router();

// Define owner's default credentials
const OWNER_EMAIL = "owner@delightresto.com";
const OWNER_PASSWORD = "Owner@123"; // Ideally hashed in a secure environment

// Hash the owner's password once for comparison
let hashedOwnerPassword;
bcrypt.hash(OWNER_PASSWORD, 10).then((hash) => {
    hashedOwnerPassword = hash;
});

// Register route
router.post('/register', async (req, res) => {
    const { name, USN, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const userExistsEmail = await User.findOne({ email });
        if (userExistsEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const lastUser = await User.findOne().sort({ customerId: -1 });
        const newCustomerId = lastUser && lastUser.customerId ? lastUser.customerId + 1 : 10001;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            customerId: newCustomerId,
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(200).json({
            message: 'Registration successful',
            customerId: newCustomerId,
            user: savedUser,
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password, loginAs } = req.body;

    try {
        if (!email || !password || !loginAs) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        if (loginAs === "owner") {
            // Owner Login
            if (email !== OWNER_EMAIL) {
                return res.status(400).json({ message: 'Invalid credentials for owner' });
            }

            const isOwnerPasswordCorrect = await bcrypt.compare(password, hashedOwnerPassword);
            if (!isOwnerPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials for owner' });
            }

            return res.status(200).json({ message: 'Owner login successful', role: 'owner' });
        } else {
            // Customer Login
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            return res.status(200).json({ message: 'Login successful', user });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
