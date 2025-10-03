import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
		title: String,
		price: Number,
		quantity: { type: Number, default: 1 },
		variant: {
			color: String,
			size: String,
		},
		image: String,
	},
	{ _id: false }
)

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		items: [orderItemSchema],
		status: {
			type: String,
			enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
			default: 'pending',
		},
		amount: { type: Number, required: true },
		shippingAddress: {
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

const Order = mongoose.model('Order', orderSchema)
export default Order


