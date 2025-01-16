import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Create user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Create User model
const User = mongoose.model('User', userSchema);

export default User;
