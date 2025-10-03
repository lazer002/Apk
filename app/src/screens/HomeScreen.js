import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { getApiBaseUrl } from '../utils/config'

export default function HomeScreen({ navigation }) {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(`${getApiBaseUrl()}/api/products`)
				const data = await res.json()
				setProducts(data)
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	if (loading) return (
		<View className="flex-1 items-center justify-center">
			<ActivityIndicator />
		</View>
	)

	return (
		<View className="flex-1 bg-white">
			<FlatList
				data={products}
				keyExtractor={(item) => String(item._id)}
				renderItem={({ item }) => (
					<TouchableOpacity
						className="flex-row p-4 border-b border-gray-100"
						onPress={() => navigation.navigate('Product', { id: item._id })}
					>
						<Image source={{ uri: item.images?.[0] }} style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: '#eee' }} />
						<View className="ml-3 flex-1">
							<Text className="text-base font-semibold">{item.title}</Text>
							<Text className="text-gray-500">₹{item.price}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	)
}


