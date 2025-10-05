// src/routes/auth.js
import express from 'express'
import { User } from '../models/User.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

const router = express.Router()

// Register with email + password
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body
    if (!email || !name || !password) return res.status(400).json({ error: 'Missing fields' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await User.hashPassword(password)
    const user = await User.create({ email, name, passwordHash })

    const payload = { id: user._id.toString(), role: user.role, email: user.email, name: user.name }
    res.json({
      user: { id: payload.id, email: user.email, name: user.name, role: user.role },
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    })
  } catch (e) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login with email + password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await user.verifyPassword(password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const payload = { id: user._id.toString(), role: user.role, email: user.email, name: user.name }
    res.json({
      user: { id: payload.id, email: user.email, name: user.name, role: user.role },
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    })
  } catch (e) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Send OTP to email
router.post('/otp/send', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    let user = await User.findOne({ email })
    if (!user) {
      // create user if not exists
      user = await User.create({ email, name: 'New User' })
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    user.otp = otp
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 min expiry
    await user.save()

    // Send OTP via email provider
    console.log(`Send OTP ${otp} to email ${email}`)

    res.json({ message: 'OTP sent' })
  } catch (e) {
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

// Verify OTP from email
router.post('/otp/verify', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'User not found' })

    if (user.otp !== otp || user.otpExpires < new Date())
      return res.status(401).json({ error: 'Invalid or expired OTP' })

    user.isVerified = true
    user.otp = null
    user.otpExpires = null
    user.lastLogin = new Date()
    await user.save()

    const payload = { id: user._id.toString(), role: user.role, email: user.email, name: user.name }
    res.json({
      user: { id: payload.id, email: user.email, name: user.name, role: user.role },
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    })
  } catch (e) {
    res.status(500).json({ error: 'OTP verification failed' })
  }
})



export default router
