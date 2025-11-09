import User from "../models/User.js";
import Pandit from "../models/Pandit.js";

// ✅ GET /api/users/:id
export const getUserDashboardData = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("User requesting:", id)
    // Fetch user
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all Pandits (or you can limit to user's preferred ones)
    const pandits = await Pandit.find()
      .select("name expertise rating")
      .limit(5)
      .lean();

    // Combine data
    const dashboardData = {
      user,
      pandits,
      chats: user.chats || [],
    };

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Error fetching user dashboard:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
