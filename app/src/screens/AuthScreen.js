import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [isFocused, setIsFocused] = useState(false) // track focus

  const handleContinue = () => {
    if (!email) return alert('Please enter your email')
    navigation.navigate('OtpVerification', { email })
  }

  const handleGoogleLogin = () => {
    navigation.navigate('GoogleLogin')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subHeading}>Login quickly to continue</Text>

      {/* Email Input */}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: isFocused ? '#FF6347' : '#ddd' } // change border on focus
        ]}
      >
        <Ionicons name="mail-outline" size={24} color="#FF6347" style={{ marginRight: 10 }} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleContinue}>
        <Text style={styles.loginButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <MaterialCommunityIcons name="google" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6347',
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // slightly thicker for focus
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})
