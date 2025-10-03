import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Order from '../models/Order.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
	res.json(orders)
})

router.post('/', requireAuth, async (req, res) => {
	const { items, shippingAddress } = req.body
	const amount = (items || []).reduce((sum, it) => sum + it.price * it.quantity, 0)
	const order = await Order.create({ user: req.user._id, items, shippingAddress, amount })
	res.status(201).json(order)
})

export default router


