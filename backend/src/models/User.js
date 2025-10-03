import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
		address: {
			line1: String,
			line2: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
	},
	{ timestamps: true }
)

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.passwordHash)
}

const User = mongoose.model('User', userSchema)
export default User


