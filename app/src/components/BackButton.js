import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        position: "absolute",
        top: 45,
        left: 20,
        zIndex: 999,
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
      }}
    >
      <View>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </View>
    </TouchableOpacity>
  );
}
