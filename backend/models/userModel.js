import bcrypt from "bcrypt";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    role: { required: true, type: String, enum: ["teacher", "student"] },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

export const User = mongoose.model("User", userSchema);
