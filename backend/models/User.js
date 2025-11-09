import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
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

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, 
    },

    phoneNo: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
      sparse: true, 
    },

    address: {
      type: String,
      trim: true,
      maxlength: [150, "Address too long"],
    },

    dateOfBirth: {
      type: Date,
    },

    placeOfBirth: {
      type: String,
      trim: true,
    },
    isLoggedIn: {
    type: Boolean,
    default: false,
  },
  },
  {
    timestamps: true, 
    versionKey: false, 
  }
);
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

userSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
userSchema.index({ phoneNo: 1 });

const User = mongoose.model("User", userSchema);
export default User;
