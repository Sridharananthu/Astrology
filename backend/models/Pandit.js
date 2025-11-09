// models/Pandit.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const panditSchema = new mongoose.Schema(
  {
    // ✅ Basic info
    name: {
      type: String,
      required: [true, "Pandit name is required"],
      trim: true,
    },

    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },

    // ✅ Language(s) they can speak
    languages: {
      type: [String],
      required: [true, "At least one language is required"],
    },

    // ✅ Skills — e.g., Vedic Astrology, Numerology, Palmistry
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
    },

    otherSkill: {
      type: String,
      trim: true,
    },

    // ✅ Contact / login info
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },

    // ✅ Hashed password for separate login
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    // ✅ Admin-managed image URL or filename
    image: {
      type: String,
      default: "default_pandit.png",
    },

    // ✅ Admin control fields
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending",
    },

    createdByAdmin: {
      type: Boolean,
      default: true, // ✅ indicates data was created by admin panel
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//
// ✅ Password hashing middleware
//
panditSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//
// ✅ Method for login comparison
//
panditSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//
// ✅ Optional: Virtual age (for admin view or profile)
//
panditSchema.virtual("age").get(function () {
  if (!this.dob) return null;
  const diff = Date.now() - this.dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

//
// ✅ Indexing for performance
//
panditSchema.index({ email: 1 }, { unique: true });
panditSchema.index({ status: 1 });
panditSchema.index({ skills: 1 });

const Pandit = mongoose.model("Pandit", panditSchema);
export default Pandit;
