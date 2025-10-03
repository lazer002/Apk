import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post(
	'/register',
	[
		body('name').notEmpty(),
		body('email').isEmail(),
		body('password').isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
		const { name, email, password } = req.body
		const existing = await User.findOne({ email })
		if (existing) return res.status(400).json({ message: 'Email in use' })
		const passwordHash = await bcrypt.hash(password, 10)
		const user = await User.create({ name, email, passwordHash })
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
		res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
	}
)

router.post(
	'/login',
	[body('email').isEmail(), body('password').notEmpty()],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ message: 'Invalid credentials' })
		const ok = await user.comparePassword(password)
		if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
		res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
	}
)

router.get('/me', requireAuth, async (req, res) => {
	res.json({ user: req.user })
})

export default router


