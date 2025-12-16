// baby-growth-app/src/screens/BabyDetailScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { babyService } from "../services/babyService";

const Tab = createMaterialTopTabNavigator();

// Tab 1: Vue d'ensemble
function OverviewTab({ baby }) {
  const calculateAgeInMonths = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    return Math.max(0, months);
  };

  const ageInMonths = calculateAgeInMonths(baby.birth_date);

  const getGenderLabel = (gender) => {
    switch (gender) {
      case "male":
        return "Garçon";
      case "female":
        return "Fille";
      default:
        return "Autre";
    }
  };

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informations du bébé</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nom:</Text>
          <Text style={styles.infoValue}>{baby.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date de naissance:</Text>
          <Text style={styles.infoValue}>
            {new Date(baby.birth_date).toLocaleDateString("fr-FR")}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Âge:</Text>
          <Text style={styles.infoValue}>{ageInMonths} mois</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Genre:</Text>
          <Text style={styles.infoValue}>{getGenderLabel(baby.gender)}</Text>
        </View>

        {baby.birth_weight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Poids naissance:</Text>
            <Text style={styles.infoValue}>{baby.birth_weight} kg</Text>
          </View>
        )}

        {baby.birth_height && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Taille naissance:</Text>
            <Text style={styles.infoValue}>{baby.birth_height} cm</Text>
          </View>
        )}

        {baby.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{baby.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Statistiques</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Mesures</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Vaccins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Visites</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Tab 2: Croissance
function GrowthTab({ baby }) {
  const [growthRecords, setGrowthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrowthRecords();
  }, []);

  const loadGrowthRecords = async () => {
    try {
      const result = await babyService.getGrowthRecords(baby.id);
      if (result.success) {
        setGrowthRecords(result.records);
      }
    } catch (error) {
      console.error("❌ Erreur chargement croissance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingTab}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement des mesures...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addRecordButton}>
          <Text style={styles.addRecordButtonText}>+ Ajouter une mesure</Text>
        </TouchableOpacity>
      </View>

      {growthRecords.length === 0 ? (
        <View style={styles.emptyTab}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Aucune mesure enregistrée</Text>
          <Text style={styles.emptyText}>
            Commencez par ajouter des mesures de poids et taille pour suivre la
            croissance
          </Text>
        </View>
      ) : (
        <View style={styles.recordsList}>
          <Text style={styles.sectionTitle}>Historique des mesures</Text>
          {growthRecords.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <Text style={styles.recordDate}>
                {new Date(record.record_date).toLocaleDateString("fr-FR")}
              </Text>
              <View style={styles.recordDetails}>
                <View style={styles.recordStat}>
                  <Text style={styles.recordLabel}>Poids:</Text>
                  <Text style={styles.recordValue}>{record.weight} kg</Text>
                </View>
                <View style={styles.recordStat}>
                  <Text style={styles.recordLabel}>Taille:</Text>
                  <Text style={styles.recordValue}>{record.height} cm</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Tab 3: Vaccinations
function VaccinationsTab({ baby }) {
  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addRecordButton}>
          <Text style={styles.addRecordButtonText}>+ Ajouter un vaccin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyTab}>
        <Text style={styles.emptyEmoji}>💉</Text>
        <Text style={styles.emptyTitle}>Aucun vaccin enregistré</Text>
        <Text style={styles.emptyText}>
          Ajoutez les vaccins reçus pour suivre le calendrier vaccinal
        </Text>
      </View>
    </ScrollView>
  );
}

// Tab 4: Santé
function HealthTab({ baby }) {
  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addRecordButton}>
          <Text style={styles.addRecordButtonText}>+ Ajouter une maladie</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyTab}>
        <Text style={styles.emptyEmoji}>🏥</Text>
        <Text style={styles.emptyTitle}>Aucun historique médical</Text>
        <Text style={styles.emptyText}>
          Enregistrez les maladies et médicaments utilisés
        </Text>
      </View>
    </ScrollView>
  );
}

// Tab 5: Repas
function MealsTab({ baby }) {
  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addRecordButton}>
          <Text style={styles.addRecordButtonText}>+ Ajouter un repas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyTab}>
        <Text style={styles.emptyEmoji}>🍎</Text>
        <Text style={styles.emptyTitle}>Aucun repas planifié</Text>
        <Text style={styles.emptyText}>Planifiez les repas de votre bébé</Text>
      </View>
    </ScrollView>
  );
}

// Écran principal avec tabs
export default function BabyDetailScreen({ navigation, route }) {
  const { babyId, babyName } = route.params;
  const [baby, setBaby] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBabyDetails();
  }, []);

  const loadBabyDetails = async () => {
    try {
      const result = await babyService.getBabyDetails(babyId);
      if (result.success) {
        setBaby(result.baby);
      } else {
        Alert.alert("Erreur", result.message || "Bébé non trouvé");
        navigation.goBack();
      }
    } catch (error) {
      console.error("❌ Erreur chargement détails:", error);
      Alert.alert("Erreur", "Impossible de charger les détails");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !baby) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#3498db",
          tabBarInactiveTintColor: "#95a5a6",
          tabBarIndicatorStyle: {
            backgroundColor: "#3498db",
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            textTransform: "none",
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#ecf0f1",
          },
        }}
      >
        <Tab.Screen name="Overview" options={{ title: "Vue d'ensemble" }}>
          {() => <OverviewTab baby={baby} />}
        </Tab.Screen>
        <Tab.Screen name="Growth" options={{ title: "Croissance" }}>
          {() => <GrowthTab baby={baby} />}
        </Tab.Screen>
        <Tab.Screen name="Vaccinations" options={{ title: "Vaccins" }}>
          {() => <VaccinationsTab baby={baby} />}
        </Tab.Screen>
        <Tab.Screen name="Health" options={{ title: "Santé" }}>
          {() => <HealthTab baby={baby} />}
        </Tab.Screen>
        <Tab.Screen name="Meals" options={{ title: "Repas" }}>
          {() => <MealsTab baby={baby} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#7f8c8d",
    fontSize: 14,
  },
  loadingTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tabContainer: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "600",
  },
  notesContainer: {
    marginTop: 15,
  },
  notesLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#2c3e50",
    lineHeight: 20,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  statsCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3498db",
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 5,
  },
  addButtonContainer: {
    marginBottom: 20,
  },
  addRecordButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addRecordButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyTab: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  recordsList: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recordCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordDate: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "600",
    marginBottom: 10,
  },
  recordDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordStat: {
    alignItems: "center",
  },
  recordLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});
