// baby-growth-app/App.js (Updated)
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// Écrans - Authentification
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Écrans - Dashboard et bébés
import DashboardScreen from "./src/screens/DashboardScreen";
import AddBabyScreen from "./src/screens/AddBabyScreen";
import EditBabyScreen from "./src/screens/EditBabyScreen";
import BabyDetailScreen from "./src/screens/BabyDetailScreen";

// Écrans - Croissance
import AddGrowthScreen from "./src/screens/AddGrowthScreen";

// Écrans - Vaccinations
import VaccinationScreen from "./src/screens/VaccinationScreen";
import AddVaccinationScreen from "./src/screens/AddVaccinationScreen";

// Écrans - Santé / Dossiers médicaux
import MedicalRecordsScreen from "./src/screens/MedicalRecordsScreen.js";
import AddMedicalRecordScreen from "./src/screens/AddMedicalRecordScreen.js";

// Écrans - Repas
import AddMealScreen from "./src/screens/AddMealScreen";

// Écrans - Tests (optionnel)
import TestConnectionScreen from "./src/screens/TestConnectionScreen";

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
        {/* ============= AUTHENTIFICATION ============= */}
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

        {/* ============= DASHBOARD ============= */}
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

        {/* ============= GESTION DES BÉBÉS ============= */}
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

        {/* ============= CROISSANCE ============= */}
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

        {/* ============= VACCINATIONS ============= */}
        <Stack.Screen
          name="Vaccination"
          component={VaccinationScreen}
          options={({ route }) => ({
            headerShown: true,
            title: "💉 Vaccinations",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          })}
        />

        <Stack.Screen
          name="AddVaccination"
          component={AddVaccinationScreen}
          options={{
            headerShown: true,
            title: "Ajouter une vaccination",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        {/* ============= SANTÉ / DOSSIERS MÉDICAUX ============= */}
        <Stack.Screen
          name="MedicalRecords"
          component={MedicalRecordsScreen}
          options={({ route }) => ({
            headerShown: true,
            title: "🏥 Santé",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          })}
        />

        <Stack.Screen
          name="AddMedicalRecord"
          component={AddMedicalRecordScreen}
          options={{
            headerShown: true,
            title: "Nouveau dossier médical",
            headerStyle: { backgroundColor: "#3498db" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        {/* ============= REPAS ============= */}
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
