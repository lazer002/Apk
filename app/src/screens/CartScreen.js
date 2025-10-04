import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { getApiBaseUrl } from '../utils/config'
import { getToken } from '../utils/token'

export default function CartScreen({ route, navigation }) {
	const [items, setItems] = useState([])

	const load = async () => {
		const token = await getToken()
		const res = await fetch(`${getApiBaseUrl()}/api/cart`, {
			headers: { Authorization: token ? `Bearer ${token}` : '' },
		})
		const data = await res.json()
		setItems(data)
	}

	useEffect(() => {
		load()
	}, [])

	return (
		<SafeAreaView>
		<View className="flex-1 bg-white">
			<FlatList
				data={items}
				keyExtractor={(_, i) => String(i)}
				renderItem={({ item }) => (
					<View className="p-4 border-b border-gray-100">
						<Text className="font-semibold">{item.title}</Text>
						<Text className="text-gray-500">Qty: {item.quantity} · ₹{item.price}</Text>
					</View>
				)}
			/>
			<TouchableOpacity
				className="m-4 bg-black py-3 rounded-md"
				onPress={() => navigation.navigate('Checkout')}
			>
				<Text className="text-center text-white font-semibold">Proceed to Checkout</Text>
			</TouchableOpacity>
		</View>
		</SafeAreaView>
	)
}


