import jwt from 'jsonwebtoken'
import {User} from '../models/User.js'

export const requireAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || ''
		const token = authHeader.startsWith('Bearer ')
			? authHeader.replace('Bearer ', '')
			: null
		if (!token) return res.status(401).json({ message: 'Unauthorized' })
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
		req.user = await User.findById(payload.id).select('-passwordHash')
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
		next()
	} catch (e) {
		return res.status(401).json({ message: 'Unauthorized' })
	}
}

export const requireAdmin = (req, res, next) => {
	if (req.user?.role !== 'admin') {
		return res.status(403).json({ message: 'Forbidden' })
	}
	next()
}


