import mongoose from 'mongoose'

const variantSchema = new mongoose.Schema(
	{
		color: String,
		size: String,
		stock: { type: Number, default: 0 },
	},
	{ _id: false }
)

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: String,
		price: { type: Number, required: true },
		brand: String,
		category: String,
		images: [String],
		variants: [variantSchema],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const Product = mongoose.model('Product', productSchema)
export default Product


