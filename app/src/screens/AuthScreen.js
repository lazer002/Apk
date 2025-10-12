import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { api } from '../utils/config';
import { AuthContext } from '../context/AuthContext';

export default function AuthScreen({ navigation }) {
  const { login } = useContext(AuthContext); // ✅ AuthContext
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Auth request
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // replace with your client ID
  });

  // Handle Google login response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  // Email OTP login
  const handleContinue = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email');

    try {
      setLoading(true);
      const res = await api.post(`/api/auth/otp/send`, { email });

      if (res.status === 200) {
        Alert.alert('OTP Sent', 'Check your email for the OTP');
        navigation.navigate('OtpVerification', { email });
      } else {
        Alert.alert('Error', res.data?.error || 'Failed to send OTP');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async (idToken) => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/google', { token: idToken });

      if (res.status === 200 && res.data?.token && res.data?.user) {
        // ✅ Use AuthContext login function
        await login(res.data.user, res.data.token, res.data.refreshToken);
        Alert.alert('Success', 'Logged in with Google!');
        navigation.replace('Tabs'); // Navigate to main app
      } else {
        Alert.alert('Error', res.data?.message || 'Google login failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subHeading}>Login quickly to continue</Text>

      {/* Email Input */}
      <View style={[styles.inputWrapper, { borderColor: isFocused ? '#FF6347' : '#ddd' }]}>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleContinue} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Continue</Text>}
      </TouchableOpacity>

      {/* Google Login */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync({ useProxy: true })}
        disabled={!request || loading}
      >
        <MaterialCommunityIcons name="google" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 80, backgroundColor: '#fff' },
  heading: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#FF6347', marginBottom: 8 },
  subHeading: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 32 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#f9f9f9', marginBottom: 16 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  loginButton: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FF6347', padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  googleButton: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#4285F4', padding: 16, borderRadius: 12, alignItems: 'center' },
  googleButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
