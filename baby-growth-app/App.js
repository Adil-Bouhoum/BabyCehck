// baby-growth-app/App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// Écrans
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import TestConnectionScreen from "./src/screens/TestConnectionScreen";
import AddBabyScreen from "./src/screens/AddBabyScreen";
import BabyDetailScreen from "./src/screens/BabyDetailScreen";
import AddGrowthScreen from "./src/screens/AddGrowthScreen";
import AddMealScreen from "./src/screens/AddMealScreen";
import EditBabyScreen from "./src/screens/EditBabyScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: "Inscription",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: true,
            title: "Mes Bébés",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="AddBaby"
          component={AddBabyScreen}
          options={{
            headerShown: true,
            title: "Ajouter un bébé",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <Stack.Screen
          name="BabyDetail"
          component={BabyDetailScreen}
          options={({ route }) => ({
            headerShown: true,
            title: route.params?.babyName || "Détails bébé",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          })}
        />

        <Stack.Screen
          name="AddGrowth"
          component={AddGrowthScreen}
          options={{
            headerShown: true,
            title: "Ajouter une mesure",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <Stack.Screen
          name="AddMeal"
          component={AddMealScreen}
          options={{
            headerShown: true,
            title: "Ajouter un repas",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <Stack.Screen
          name="EditBaby"
          component={EditBabyScreen}
          options={{
            headerShown: true,
            title: "Modifier le bébé",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
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
