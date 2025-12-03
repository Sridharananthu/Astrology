import Pandit from "../models/Pandit.js";
import ChatSession from "../models/chat.js";
import ChatRequest from "../models/ChatRequest.js";
import generateToken from "../utils/generateToken.js";

/* ============================================================
   REGISTER PANDIT
============================================================ */
export const registerPandit = async (req, res) => {
  try {
    const { name, dob, gender, languages, skills, otherSkill, email, password } =
      req.body;

    if (!name || !dob || !gender || !languages || !skills || !email || !password) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const existing = await Pandit.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const parsedLanguages =
      typeof languages === "string" ? languages.split(",").map((l) => l.trim()) : languages;

    const parsedSkills =
      typeof skills === "string" ? JSON.parse(skills) : skills;

    const pandit = new Pandit({
      name,
      dob,
      gender,
      languages: parsedLanguages,
      skills: parsedSkills,
      otherSkill,
      email,
      password,
      status: "pending",
      createdByAdmin: false,
      isVerified: false,
      isOnline: false,
    });

    if (req.file) pandit.image = `/uploads/${req.file.filename}`;

    await pandit.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful! Await admin approval.",
      data: pandit,
    });
  } catch (err) {
    console.error("❌ registerPandit:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ============================================================
   LOGIN PANDIT
============================================================ */
export const loginPandit = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pandit = await Pandit.findOne({ email }).select("+password");
    if (!pandit) {
      return res.status(404).json({ success: false, message: "Pandit not found" });
    }

    const isMatch = await pandit.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(pandit._id, "pandit");

    const panditData = pandit.toObject();
    delete panditData.password;

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: panditData,
    });
  } catch (err) {
    console.error("❌ loginPandit:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ============================================================
   GET ALL PANDITS
============================================================ */
export const getAllPandits = async (req, res) => {
  try {
    const pandits = await Pandit.find().select(
      "name image languages skills experience status isOnline currentSession rate"
    );

    res.json({
      success: true,
      pandit: pandits,
      count: pandits.length,
    });
  } catch (err) {
    console.error("❌ getAllPandits:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ============================================================
   GET PANDIT DASHBOARD
============================================================ */
export const getPanditDashboard = async (req, res) => {
  try {
    const panditId = req.params.id;

    const pandit = await Pandit.findById(panditId).select("-password");
    if (!pandit) {
      return res.status(404).json({ success: false, message: "Pandit not found" });
    }

    const sessions = await ChatSession.find({ panditId }).populate("userId", "name email");

    const recentOrders = sessions.map((session) => ({
      id: session._id,
      userId: session.userId._id,
      client: session.userId.name,
      email: session.userId.email,
      status: session.isActive ? "Active" : "Closed",
      date: new Date(session.updatedAt).toLocaleDateString(),
    }));

    return res.json({
      success: true,
      pandit,
      recentOrders,
    });
  } catch (err) {
    console.error("❌ getPanditDashboard:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ============================================================
   UPDATE ONLINE STATUS
============================================================ */
export const updatePanditOnlineStatus = async (req, res) => {
  try {
    const panditId = req.params.id;
    const { isOnline } = req.body;

    const pandit = await Pandit.findById(panditId);
    if (!pandit) return res.status(404).json({ success: false, message: "Pandit not found" });

    pandit.isOnline = !!isOnline;
    await pandit.save();

    // Emit to all connected clients
    const io = req.app.get("io");
    if (io) {
      io.emit("pandit_status_update", {
        panditId: pandit._id.toString(),
        isOnline: pandit.isOnline,
        currentSession: pandit.currentSession || null,
      });
    }

    res.json({
      success: true,
      message: `Status updated to ${isOnline ? "Online" : "Offline"}`,
      isOnline: pandit.isOnline,
    });
  } catch (err) {
    console.error("❌ updatePanditOnlineStatus:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ============================================================
   ⭐ GET PANDIT CHAT REQUESTS
============================================================ */
export const getPanditRequests = async (req, res) => {
  try {
    const panditId = req.params.id;

    const requests = await ChatRequest.find({
      panditId,
      accepted: false,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests.map((req) => ({
        _id: req._id,
        user: req.userId,
        userId: req.userId?._id,
        roomId: req.roomId,
        createdAt: req.createdAt,
      })),
    });
  } catch (err) {
    console.error("❌ getPanditRequests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteChatRequest = async (req, res) => {
  try {
    const { roomId } = req.body; // frontend sends the roomId

    if (!roomId) {
      return res.status(400).json({ success: false, message: "roomId is required" });
    }

    const deleted = await ChatRequest.findOneAndDelete({ roomId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Chat request removed successfully" });
  } catch (err) {
    console.error("❌ deleteChatRequest:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   UPDATE SESSION STATUS
   (chat/call/null) — used to mark busy/free and emit realtime
============================================================ */
export const updatePanditSessionStatus = async (req, res) => {
  try {
    const panditId = req.params.id;
    const { status } = req.body;

    const pandit = await Pandit.findById(panditId);
    if (!pandit) {
      return res.status(404).json({ success: false, message: "Pandit not found" });
    }

    pandit.currentSession = status || null;
    await pandit.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("pandit_status_update", {
        panditId: pandit._id.toString(),
        isOnline: pandit.isOnline,
        currentSession: pandit.currentSession,
      });
    }

    res.json({
      success: true,
      currentSession: pandit.currentSession,
    });
  } catch (error) {
    console.error("updatePanditSessionStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};