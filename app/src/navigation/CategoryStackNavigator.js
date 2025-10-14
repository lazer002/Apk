// src/navigation/CategoryStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CategoriesScreen from "../screens/CategoriesScreen";
import ProductListingScreen from "../screens/ProductListingScreen"; // PLP
import ProductScreen from "../screens/ProductScreen";
import ScreenWrapper from "../components/ScreenWrapper";

const Stack = createNativeStackNavigator();

export default function CategoryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* Categories Screen (Home equivalent) */}
      <Stack.Screen name="Categories">
        {(props) => (
          <ScreenWrapper>
            <CategoriesScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      {/* Product Listing Page (PLP) */}
      <Stack.Screen name="CategoryProducts">
        {(props) => (
          <ScreenWrapper>
            <ProductListingScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      {/* Single Product Detail Page */}
      <Stack.Screen name="ProductScreen">
        {(props) => (
          <ScreenWrapper>
            <ProductScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      
    </Stack.Navigator>
  );
}
