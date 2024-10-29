import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the new user
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Respond with the token and success message
    res.status(201).json({ message: "User registered", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
