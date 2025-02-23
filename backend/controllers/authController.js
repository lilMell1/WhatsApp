const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => { 
  const { username, password, phoneNumber } = req.body;

  try {
    let existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      if (existingUser.isActive) {
        return res.status(400).json({ message: "User already exists with this phone number" });
      } else {
        // reactivate user instead of rejecting
        existingUser.username = username;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.isActive = true;
        await existingUser.save();
        return res.status(200).json({ message: "Account reactivated successfully" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, phoneNumber, isActive: true });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => { 
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, isActive: true });
    if (!user) return res.status(400).json({ message: "Invalid credentials or inactive account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: false,
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful", token });

  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username isActive");

    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    res.json({ userId: user._id, username: user.username });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ message: "Logged out successfully" });
};
