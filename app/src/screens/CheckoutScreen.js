import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { getApiBaseUrl } from '../utils/config'
import { getToken } from '../utils/token'

export default function CheckoutScreen() {
	const [address, setAddress] = useState({ line1: '', city: '', zip: '' })

	const submit = async () => {
		const token = await getToken()
		const res = await fetch(`${getApiBaseUrl()}/api/orders`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
			body: JSON.stringify({ items: [], shippingAddress: address }),
		})
		if (res.ok) Alert.alert('Order placed!')
		else Alert.alert('Failed to place order')
	}

	return (
		<View className="flex-1 bg-white p-4">
			<Text className="text-xl font-bold mb-4">Shipping Address</Text>
			<TextInput placeholder="Address line" className="border p-3 rounded mb-2" value={address.line1} onChangeText={(t) => setAddress({ ...address, line1: t })} />
			<TextInput placeholder="City" className="border p-3 rounded mb-2" value={address.city} onChangeText={(t) => setAddress({ ...address, city: t })} />
			<TextInput placeholder="ZIP" className="border p-3 rounded mb-4" value={address.zip} onChangeText={(t) => setAddress({ ...address, zip: t })} />
			<TouchableOpacity className="bg-black py-3 rounded-md" onPress={submit}>
				<Text className="text-center text-white font-semibold">Place Order</Text>
			</TouchableOpacity>
		</View>
	)
}


