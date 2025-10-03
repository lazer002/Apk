import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { getApiBaseUrl } from '../utils/config'
import { saveToken } from '../utils/token'

export default function AuthScreen({ navigation }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const login = async () => {
		const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})
		const data = await res.json()
		if (res.ok) {
			await saveToken(data.token)
			Alert.alert('Logged in')
			navigation.goBack()
		} else {
			Alert.alert('Login failed')
		}
	}

	return (
		<View className="flex-1 bg-white p-4">
			<Text className="text-xl font-bold mb-4">Login</Text>
			<TextInput placeholder="Email" className="border p-3 rounded mb-2" value={email} onChangeText={setEmail} autoCapitalize="none" />
			<TextInput placeholder="Password" className="border p-3 rounded mb-4" value={password} onChangeText={setPassword} secureTextEntry />
			<TouchableOpacity className="bg-black py-3 rounded-md" onPress={login}>
				<Text className="text-center text-white font-semibold">Login</Text>
			</TouchableOpacity>
		</View>
	)
}


