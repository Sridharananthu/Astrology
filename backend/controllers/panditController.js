import Pandit from "../models/Pandit.js";
import jwt from "jsonwebtoken";
import ChatSession from "../models/chat.js"; // to fetch user-pending chat sessions
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// @desc    Register a new Pandit
// @route   POST /api/pandits/register
// @access  Public  
export const registerPandit = async (req, res) => {
  try {
    console.log("📥 Incoming Registration Data:", req.body);

    // Check if email already exists
    const existingPandit = await Pandit.findOne({ email: req.body.email });
    if (existingPandit) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create Pandit document
    const pandit = new Pandit(req.body);

    // Save to DB
    await pandit.save();

    // Generate JWT (for authentication + socket session auth later)
    const token = jwt.sign(
      { id: pandit._id, role: "pandit" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response (never include password)
    const panditData = pandit.toObject();
    delete panditData.password;

    console.log("✅ Pandit Registered:", panditData.email);

    res.status(201).json({
      success: true,
      message: "Pandit registered successfully",
      token,
      data: panditData,
    });
  } catch (error) {
    console.error("❌ Error in registerPandit:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
      errors: error.errors || null,
    });
  }
};

export const getAllPandits = async (req, res) => {
  try {
    const pandits = await Pandit.find(); // Fetch all
    res.status(200).json({
      success: true,
      count: pandits.length,
      pandits,
    });
  } catch (error) {
    console.error("❌ Error fetching pandits:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// @desc    Login Pandit
// @route   POST /api/pandits/login
// @access  Public
export const loginPandit = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Body recieved:". email);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Explicitly include password since it's excluded by default
    const pandit = await Pandit.findOne({ email }).select("+password");

    if (!pandit) {
      return res.status(404).json({
        success: false,
        message: "Pandit not found",
      });
    }

    // ✅ Compare entered password with hashed password
    const isMatch = await pandit.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Generate JWT (with role for sockets)
    const token = jwt.sign(
      { id: pandit._id, role: "pandit" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("token found",token);

    // ✅ Exclude password before sending
    const panditData = pandit.toObject();
    delete panditData.password;

    console.log(`✅ Pandit Logged In: ${pandit.email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: panditData,
    });
  } catch (error) {
    console.error("❌ Error in loginPandit:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Get Pandit Dashboard (profile data)
// @route   GET /api/pandits/:id/dashboard
// @access  Private
// export const getPanditDashboard = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pandit = await Pandit.findById(id).select("-password");

//     if (!pandit) {
//       return res.status(404).json({ message: "Pandit not found" });
//     }

//     res.status(200).json({
//       pandit,
//       stats: {
//         totalSessions: 10,
//         totalEarnings: 3200,
//         rating: pandit.rating,
//       },
//     });
//   } catch (error) {
//     console.error("Error in getPanditDashboard:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



export const getPanditDashboard = async (req, res) => {
  try {
    const panditId = req.params.id;
    console.log(panditId);
    const pandit = await Pandit.findById(panditId).select("-password");
    if (!pandit) {
      return res.status(404).json({ success: false, message: "Pandit not found" });
    }
    console.log(pandit);
    // 🧩 Fetch all chat sessions or bookings related to this Pandit
    const sessions = await ChatSession.find({ panditId }).populate("userId", "name email");

    // Transform the sessions into recentOrders-like structure
    const recentOrders = sessions.map((session) => ({
      id: session._id,
      userId: session.userId._id,
      client: session.userId.name,
      email: session.userId.email,
      status: session.isActive ? "Active" : "Closed",
      date: new Date(session.updatedAt).toLocaleDateString(),
    }));

    // Dummy stats (you can calculate from DB if you have orders)
    const stats = {
      pending: recentOrders.filter((o) => o.status === "Active").length,
      upcoming: 1,
      completed: 5,
      walletBalance: 2450,
    };

    return res.status(200).json({
      success: true,
      pandit,
      stats,
      recentOrders,
    });
  } catch (error) {
    console.error("❌ Error in getPanditDashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

