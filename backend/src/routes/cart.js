import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Product from '../models/Product.js'

const router = express.Router()

// In-memory cart per user session for demo; in production use DB/Redis
const userIdToCart = new Map()

router.get('/', requireAuth, (req, res) => {
	const cart = userIdToCart.get(String(req.user._id)) || []
	res.json(cart)
})

router.post('/add', requireAuth, async (req, res) => {
	const { productId, quantity = 1, variant } = req.body
	const product = await Product.findById(productId)
	if (!product) return res.status(404).json({ message: 'Product not found' })
	const userId = String(req.user._id)
	const cart = userIdToCart.get(userId) || []
	const existing = cart.find((c) => String(c.productId) === String(productId) && JSON.stringify(c.variant||{}) === JSON.stringify(variant||{}))
	if (existing) existing.quantity += Number(quantity)
	else cart.push({ productId, title: product.title, price: product.price, quantity: Number(quantity), variant, image: product.images?.[0] })
	userIdToCart.set(userId, cart)
	res.json(cart)
})

router.post('/remove', requireAuth, (req, res) => {
	const { productId, variant } = req.body
	const userId = String(req.user._id)
	const cart = userIdToCart.get(userId) || []
	const next = cart.filter((c) => !(String(c.productId) === String(productId) && JSON.stringify(c.variant||{}) === JSON.stringify(variant||{})))
	userIdToCart.set(userId, next)
	res.json(next)
})

router.post('/clear', requireAuth, (req, res) => {
	userIdToCart.delete(String(req.user._id))
	res.json([])
})

export default router


