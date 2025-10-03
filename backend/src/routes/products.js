import express from 'express'
import { body, validationResult } from 'express-validator'
import Product from '../models/Product.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
	const { q, category, brand, min, max, limit = 20, page = 1 } = req.query
	const filter = { isActive: true }
	if (q) filter.title = { $regex: q, $options: 'i' }
	if (category) filter.category = category
	if (brand) filter.brand = brand
	if (min || max) filter.price = { ...(min && { $gte: Number(min) }), ...(max && { $lte: Number(max) }) }
	const docs = await Product.find(filter)
		.skip((Number(page) - 1) * Number(limit))
		.limit(Number(limit))
		.sort({ createdAt: -1 })
	res.json(docs)
})

router.get('/:id', async (req, res) => {
	const doc = await Product.findById(req.params.id)
	if (!doc) return res.status(404).json({ message: 'Not found' })
	res.json(doc)
})

router.post(
	'/',
	requireAuth,
	requireAdmin,
	[body('title').notEmpty(), body('price').isFloat({ gt: 0 })],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
		const doc = await Product.create(req.body)
		res.status(201).json(doc)
	}
)

router.put(
	'/:id',
	requireAuth,
	requireAdmin,
	async (req, res) => {
		const doc = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
		if (!doc) return res.status(404).json({ message: 'Not found' })
		res.json(doc)
	}
)

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
	const doc = await Product.findByIdAndDelete(req.params.id)
	if (!doc) return res.status(404).json({ message: 'Not found' })
	res.json({ success: true })
})

export default router


