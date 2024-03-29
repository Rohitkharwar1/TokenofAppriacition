import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      default: "member",
      enum: ["supermanager", "manager", "member"],
    },
    wallet: {
      type: Number,
      default: 0,
      required: false,
    },
    tokenAlloted: {
      type: Number,
      default: 0,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (userPasswd) {
  return await bcrypt.compare(userPasswd, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
