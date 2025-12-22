const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Authorization feature
      default: 'user',
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationToken: String,
    groups: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: 'Group' 
    }],
    fcmToken: String,
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving (pre-save hook)
// REMOVED 'next' parameter to use pure async/await logic
userSchema.pre('save', async function () {
  // 1. If password is not modified, simply return (promise resolves automatically)
  if (!this.isModified('password')) {
    return;
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);