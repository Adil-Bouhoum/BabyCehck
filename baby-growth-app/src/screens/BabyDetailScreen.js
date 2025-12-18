// baby-growth-app/src/screens/BabyDetailScreen.js (Fixed)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { babyService } from "../services/babyService";

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: "📊" },
  { id: "growth", label: "Croissance", icon: "📈" },
  { id: "vaccinations", label: "Vaccins", icon: "💉" },
  { id: "health", label: "Santé", icon: "🏥" },
  { id: "meals", label: "Repas", icon: "🍎" },
];

const TabButton = ({ tab, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={() => onPress(tab.id)}
  >
    <Text style={styles.tabIcon}>{tab.icon}</Text>
    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
      {tab.label}
    </Text>
  </TouchableOpacity>
);

// Tab: Vue d'ensemble
const OverviewTab = ({ baby, navigation }) => {
  const calculateAgeInMonths = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    return Math.max(
      0,
      (now.getFullYear() - birth.getFullYear()) * 12 +
        (now.getMonth() - birth.getMonth())
    );
  };

  const ageInMonths = calculateAgeInMonths(baby.birth_date);

  return (
    <ScrollView style={styles.tabContent}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditBaby", { baby })}
      >
        <Text style={styles.editButtonText}>✏️ Modifier les informations</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>👶 Informations du bébé</Text>

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
          <Text style={styles.infoValue}>
            {baby.gender === "male"
              ? "Garçon"
              : baby.gender === "female"
              ? "Fille"
              : "Autre"}
          </Text>
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
      </View>

      {baby.notes && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Notes</Text>
          <Text style={styles.notesText}>{baby.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
};

// Tab: Croissance
const GrowthTab = ({ baby, navigation, onRefresh }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrowthRecords();
  }, []);

  const loadGrowthRecords = async () => {
    try {
      const result = await babyService.getGrowthRecords(baby.id);
      if (result.success) {
        setRecords(result.records);
      }
    } catch (error) {
      console.error("Erreur chargement croissance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = (recordId) => {
    Alert.alert(
      "Supprimer la mesure",
      "Êtes-vous sûr de vouloir supprimer cette mesure ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await babyService.deleteGrowthRecord(
                baby.id,
                recordId
              );
              if (result.success) {
                Alert.alert("Succès", "Mesure supprimée");
                loadGrowthRecords();
                onRefresh();
              }
            } catch (error) {
              console.error("Erreur suppression:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("AddGrowth", {
            babyId: baby.id,
            babyName: baby.name,
          })
        }
      >
        <Text style={styles.addButtonText}>+ Ajouter une mesure</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.emptyText}>Chargement...</Text>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Aucune mesure enregistrée</Text>
          <Text style={styles.emptyText}>
            Ajoutez des mesures de poids et taille pour suivre la croissance
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Historique des mesures</Text>
          {records.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>
                  {new Date(record.measurement_date).toLocaleDateString(
                    "fr-FR"
                  )}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteRecord(record.id)}
                  style={styles.deleteIcon}
                >
                  <Text style={styles.deleteIconText}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recordDetails}>
                <Text style={styles.recordText}>Poids: {record.weight} kg</Text>
                <Text style={styles.recordText}>
                  Taille: {record.height} cm
                </Text>
                {record.head_circumference && (
                  <Text style={styles.recordText}>
                    PC: {record.head_circumference} cm
                  </Text>
                )}
                {record.bmi && (
                  <Text style={styles.recordText}>IMC: {record.bmi}</Text>
                )}
              </View>
              {record.notes && (
                <Text style={styles.recordNotes}>{record.notes}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Tab: Vaccinations
const VaccinationsTab = ({ baby, navigation }) => (
  <View style={styles.tabContent}>
    <TouchableOpacity
      style={styles.addButton}
      onPress={() =>
        navigation.navigate("Vaccination", {
          babyId: baby.id,
          babyName: baby.name,
        })
      }
    >
      <Text style={styles.addButtonText}>Voir le calendrier vaccinal</Text>
    </TouchableOpacity>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>💉 Calendrier vaccinal</Text>
      <Text style={styles.infoText}>
        Consultez et gérez le calendrier vaccinal complet de {baby.name}
      </Text>
    </View>
  </View>
);

// Tab: Santé
const HealthTab = ({ baby, navigation }) => (
  <View style={styles.tabContent}>
    <TouchableOpacity
      style={styles.addButton}
      onPress={() =>
        navigation.navigate("MedicalRecords", {
          babyId: baby.id,
          babyName: baby.name,
        })
      }
    >
      <Text style={styles.addButtonText}>Voir l'historique médical</Text>
    </TouchableOpacity>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🏥 Santé et médical</Text>
      <Text style={styles.infoText}>
        Enregistrez les maladies, médicaments et consultations médicales
      </Text>
    </View>
  </View>
);

// Tab: Repas
const MealsTab = ({ baby, navigation, onRefresh }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const result = await babyService.getMealPlans(baby.id);
      if (result.success) {
        setMeals(result.meals);
      }
    } catch (error) {
      console.error("Erreur chargement repas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = (mealId) => {
    Alert.alert(
      "Supprimer le repas",
      "Êtes-vous sûr de vouloir supprimer ce repas ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await babyService.deleteMealPlan(baby.id, mealId);
              if (result.success) {
                Alert.alert("Succès", "Repas supprimé");
                loadMeals();
                onRefresh();
              }
            } catch (error) {
              console.error("Erreur suppression:", error);
            }
          },
        },
      ]
    );
  };

  const getMealIcon = (type) => {
    switch (type) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "☀️";
      case "snack":
        return "🍪";
      case "dinner":
        return "🌙";
      default:
        return "🍽️";
    }
  };

  const getMealLabel = (type) => {
    switch (type) {
      case "breakfast":
        return "Petit-déjeuner";
      case "lunch":
        return "Déjeuner";
      case "snack":
        return "Goûter";
      case "dinner":
        return "Dîner";
      default:
        return "Repas";
    }
  };

  return (
    <ScrollView style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("AddMeal", {
            babyId: baby.id,
            babyName: baby.name,
          })
        }
      >
        <Text style={styles.addButtonText}>+ Ajouter un repas</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.emptyText}>Chargement...</Text>
        </View>
      ) : meals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🍎</Text>
          <Text style={styles.emptyTitle}>Aucun repas planifié</Text>
          <Text style={styles.emptyText}>
            Planifiez les repas de votre bébé
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍎 Planning repas</Text>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <View style={styles.mealHeaderLeft}>
                  <Text style={styles.mealIcon}>
                    {getMealIcon(meal.meal_type)}
                  </Text>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealType}>
                      {getMealLabel(meal.meal_type)}
                    </Text>
                    <Text style={styles.mealDate}>
                      {new Date(meal.meal_date).toLocaleDateString("fr-FR")}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteMeal(meal.id)}
                  style={styles.deleteIcon}
                >
                  <Text style={styles.deleteIconText}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.mealFood}>{meal.food_name}</Text>
              {meal.quantity && (
                <Text style={styles.mealQuantity}>
                  Quantité: {meal.quantity}
                </Text>
              )}
              {meal.notes && <Text style={styles.mealNotes}>{meal.notes}</Text>}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Écran principal
export default function BabyDetailScreen({ navigation, route }) {
  const { babyId, babyName } = route.params;
  const [baby, setBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadBabyDetails();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadBabyDetails();
    });
    return unsubscribe;
  }, [navigation]);

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

  const renderTabContent = () => {
    if (!baby) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewTab baby={baby} navigation={navigation} />;
      case "growth":
        return (
          <GrowthTab
            baby={baby}
            navigation={navigation}
            onRefresh={loadBabyDetails}
          />
        );
      case "vaccinations":
        return <VaccinationsTab baby={baby} navigation={navigation} />;
      case "health":
        return <HealthTab baby={baby} navigation={navigation} />;
      case "meals":
        return (
          <MealsTab
            baby={baby}
            navigation={navigation}
            onRefresh={loadBabyDetails}
          />
        );
      default:
        return <OverviewTab baby={baby} navigation={navigation} />;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onPress={setActiveTab}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>{renderTabContent()}</View>
    </View>
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
  tabsWrapper: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
    minWidth: 75,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#3498db",
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  tabLabel: {
    fontSize: 11,
    color: "#95a5a6",
    fontWeight: "500",
    textAlign: "center",
  },
  tabLabelActive: {
    color: "#3498db",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  card: {
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
  infoText: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  notesText: {
    fontSize: 14,
    color: "#2c3e50",
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyState: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 15,
    alignItems: "center",
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
  },
  emptyText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
  },
  recordItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  recordDate: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "600",
  },
  recordDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  recordText: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
    marginRight: 15,
  },
  recordNotes: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 8,
    fontStyle: "italic",
  },
  deleteIcon: {
    padding: 5,
  },
  deleteIconText: {
    fontSize: 20,
  },
  mealItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  mealDate: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  mealFood: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  mealQuantity: {
    fontSize: 12,
    color: "#3498db",
    marginBottom: 5,
  },
  mealNotes: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
});
