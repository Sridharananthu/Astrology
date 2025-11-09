import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { email, password, phoneNo, address, dateOfBirth, placeOfBirth } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({
      email,
      password,
      phoneNo,
      address,
      dateOfBirth,
      placeOfBirth,
    });
    res.status(201).json({
      _id: user._id,
      email: user.email,
      phoneNo: user.phoneNo,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    if (user.isLoggedIn) {
      return res.status(403).json({ message: "User session already active" });
    }

    user.isLoggedIn = true;
    await user.save();

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNo: user.phoneNo,
      token: generateToken(user._id),
      isLoggedIn : true,
      message: "Login successful",
    });

    console.log("Login successful for:", user.email);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    let userId;

    // ✅ Extract token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn("⚠️ Token invalid or expired during logout:", err.message);
        // Decode anyway to get user id even if expired
        const decoded = jwt.decode(token);
        if (decoded?.id) userId = decoded.id;
      }
    }

    // ✅ Reset login status if user exists
    if (userId) {
      await User.findByIdAndUpdate(userId, { isLoggedIn: false });
      console.log(`User ${userId} marked as logged out.`);
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

