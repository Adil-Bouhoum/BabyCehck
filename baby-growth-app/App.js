// App.js - REACT NAVIGATION V6 (STACK NAVIGATOR)
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// Importez vos écrans existants
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import TestConnectionScreen from "./src/screens/TestConnectionScreen";

// Créer le navigateur avec Stack Navigator v6
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Court délai pour le splash screen
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>BabyCheck</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          // Options simplifiées pour éviter les problèmes
          animationEnabled: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="TestConnection"
          component={TestConnectionScreen}
          options={{
            headerShown: true,
            title: "Test Connexion",
          }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: "Inscription",
            headerStyle: {
              backgroundColor: "#3498db",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: true,
            title: "Mes Bébés",
            headerStyle: {
              backgroundColor: "#3498db",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            // Pas de bouton retour (user doit logout)
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#3498db",
  },
});
