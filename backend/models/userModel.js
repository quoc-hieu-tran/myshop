import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare plaintext to the stored hash
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before save (only if modified/new)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model("User", userSchema);
export default User;
