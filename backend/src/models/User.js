import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  phone: String,
}, { _id: false }) // optional subdocument id

const userSchema = new mongoose.Schema(
  {
    // Authentication
    email: { type: String, lowercase: true, unique: true, sparse: true }, // sparse: optional
    phone: { type: String, unique: true, required: true, index: true }, // mandatory for mobile login
    passwordHash: { type: String }, // optional if phone + OTP login

    // Profile
    name: { type: String, required: true },
    avatar: { type: String }, // profile picture URL
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },

    // App-specific
    addresses: [addressSchema], // multiple delivery addresses
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // favorite products
    cart: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      size: { type: String },
      color: { type: String }
    }],

    // Analytics / optional
    lastLogin: { type: Date },
    isVerified: { type: Boolean, default: false }, // phone/email verification
  },
  { timestamps: true }
)

// Method to verify password
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash)
}

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
  }
  next()
})

export const User = mongoose.model('User', userSchema)
