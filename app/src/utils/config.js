import Constants from 'expo-constants'

export function getApiBaseUrl() {
	// Change to LAN IP when running on device, e.g., http://192.168.1.10:4000
	return Constants.expoConfig?.extra?.API_URL || 'http://localhost:4000'
}


