import express from 'express'
const router = express.Router()
import {Category}  from '../models/Category.js'

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({})
        res.json({ categories })
    } catch (error) {
        console.error('Error fetching categories:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router