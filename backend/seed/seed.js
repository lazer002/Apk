import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from '../src/models/Product.js'

dotenv.config({ path: process.env.ENV_PATH || '.env' })

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecom'

const sampleProducts = [
	{
		title: 'Classic Tee',
		description: '100% cotton classic T-shirt',
		price: 499,
		brand: 'ACME',
		category: 'Tops',
		images: [
			'https://images.unsplash.com/photo-1520975954732-35dd222996f5?q=80&w=600&auto=format&fit=crop',
		],
		variants: [
			{ color: 'Black', size: 'S', stock: 10 },
			{ color: 'Black', size: 'M', stock: 15 },
		],
	},
	{
		title: 'Denim Jacket',
		description: 'Washed denim jacket with pockets',
		price: 2999,
		brand: 'DenimCo',
		category: 'Outerwear',
		images: [
			'https://images.unsplash.com/photo-1520974735194-2e4d8f3a14f3?q=80&w=600&auto=format&fit=crop',
		],
		variants: [
			{ color: 'Blue', size: 'M', stock: 7 },
			{ color: 'Blue', size: 'L', stock: 5 },
		],
	},
]

async function run() {
	await mongoose.connect(MONGO_URI)
	await Product.deleteMany({})
	await Product.insertMany(sampleProducts)
	console.log('Seeded products:', sampleProducts.length)
	await mongoose.disconnect()
}

run().catch((e) => {
	console.error(e)
	process.exit(1)
})


