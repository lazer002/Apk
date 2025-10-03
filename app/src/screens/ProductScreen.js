import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getApiBaseUrl } from '../utils/config'

export default function ProductScreen({ route, navigation }) {
	const { id } = route.params
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(`${getApiBaseUrl()}/api/products/${id}`)
				const data = await res.json()
				setProduct(data)
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [id])

	if (loading) return (
		<View className="flex-1 items-center justify-center">
			<ActivityIndicator />
		</View>
	)

	if (!product) return (
		<View className="flex-1 items-center justify-center">
			<Text>Not found</Text>
		</View>
	)

	return (
		<ScrollView className="flex-1 bg-white">
			<Image source={{ uri: product.images?.[0] }} style={{ width: '100%', height: 320, backgroundColor: '#eee' }} />
			<View className="p-4">
				<Text className="text-xl font-bold">{product.title}</Text>
				<Text className="text-lg text-gray-700 mt-1">₹{product.price}</Text>
				<Text className="text-gray-500 mt-2">{product.description}</Text>
				<TouchableOpacity
					className="mt-4 bg-black py-3 rounded-md"
					onPress={() => navigation.navigate('Cart', { add: { productId: product._id } })}
				>
					<Text className="text-center text-white font-semibold">Add to Cart</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}


