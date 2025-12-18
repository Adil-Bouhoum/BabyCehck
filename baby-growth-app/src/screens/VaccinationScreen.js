// baby-growth-app/src/screens/VaccinationScreen.js
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
  FlatList,
} from "react-native";
import { babyService } from "../services/babyService";

const VaccinationScreen = ({ route, navigation }) => {
  const { babyId, babyName } = route.params;
  const [calendar, setCalendar] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("calendar"); // calendar or list

  useEffect(() => {
    loadVaccinationData();
  }, []);

  const loadVaccinationData = async () => {
    setLoading(true);
    try {
      const calendarResult = await babyService.getVaccinationCalendar(babyId);
      const recommendedResult = await babyService.getRecommendedVaccinations(
        babyId
      );

      if (calendarResult.success) {
        setCalendar(calendarResult.calendar || []);
      }
      if (recommendedResult.success) {
        setRecommended(recommendedResult.recommended || []);
      }
    } catch (error) {
      console.error("Erreur chargement vaccinations:", error);
      Alert.alert("Erreur", "Impossible de charger les vaccinations");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#2ecc71";
      case "overdue":
        return "#e74c3c";
      case "scheduled":
        return "#f39c12";
      default:
        return "#95a5a6";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "✅ Effectué";
      case "overdue":
        return "⚠️ En retard";
      case "scheduled":
        return "📅 Programmé";
      default:
        return status;
    }
  };

  const handleAddVaccination = () => {
    navigation.navigate("AddVaccination", {
      babyId,
      babyName,
      onVaccinationAdded: loadVaccinationData,
    });
  };

  const handleDeleteVaccination = (vaccinationId) => {
    Alert.alert(
      "Supprimer la vaccination",
      "Êtes-vous sûr de vouloir supprimer cette vaccination ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await babyService.deleteVaccination(
                babyId,
                vaccinationId
              );
              if (result.success) {
                Alert.alert("Succès", "Vaccination supprimée");
                loadVaccinationData();
              } else {
                Alert.alert("Erreur", "Impossible de supprimer");
              }
            } catch (error) {
              console.error("Erreur suppression:", error);
              Alert.alert("Erreur", "Une erreur est survenue");
            }
          },
        },
      ]
    );
  };

  const renderCalendarItem = ({ item }) => (
    <View style={styles.calendarItem}>
      <View style={styles.calendarItemLeft}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <View style={styles.calendarItemInfo}>
          <Text style={styles.vaccineName}>{item.vaccine_name}</Text>
          <Text style={styles.vaccineDetails}>
            Dose {item.dose_number}/{item.total_doses}
          </Text>
          <Text style={styles.vaccineDate}>
            📅 Prévue:{" "}
            {new Date(item.recommended_date).toLocaleDateString("fr-FR")}
          </Text>
          {item.actual_date && (
            <Text style={styles.vaccineDate}>
              ✅ Administrée:{" "}
              {new Date(item.actual_date).toLocaleDateString("fr-FR")}
            </Text>
          )}
          {item.is_mandatory && (
            <Text style={styles.mandatory}>⚖️ Obligatoire</Text>
          )}
        </View>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
      </View>
    </View>
  );

  const renderVaccinationListItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <View style={styles.listItemTitle}>
          <Text style={styles.listItemName}>{item.vaccine_name}</Text>
          {item.dose_number && (
            <Text style={styles.listItemDose}>
              Dose {item.dose_number}
              {item.total_doses ? `/${item.total_doses}` : ""}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteVaccination(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listItemDetails}>
        {item.vaccination_date && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(item.vaccination_date).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        )}
        {item.due_date && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Prochaine:</Text>
            <Text style={styles.detailValue}>
              {new Date(item.due_date).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        )}
        {item.status && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Statut:</Text>
            <Text style={styles.detailValue}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        )}
        {item.lot_number && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lot:</Text>
            <Text style={styles.detailValue}>{item.lot_number}</Text>
          </View>
        )}
        {item.clinic && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lieu:</Text>
            <Text style={styles.detailValue}>{item.clinic}</Text>
          </View>
        )}
      </View>

      {item.notes && <Text style={styles.itemNotes}>📝 {item.notes}</Text>}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>💉</Text>
      <Text style={styles.emptyTitle}>Aucune vaccination</Text>
      <Text style={styles.emptyText}>
        Commencez par ajouter les vaccinations de votre bébé
      </Text>
    </View>
  );

  if (loading) {
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
      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "calendar" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("calendar")}
        >
          <Text style={styles.tabButtonText}>📋 Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "list" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("list")}
        >
          <Text style={styles.tabButtonText}>📝 Liste</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Vaccination Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddVaccination}
        >
          <Text style={styles.addButtonText}>+ Ajouter une vaccination</Text>
        </TouchableOpacity>

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <View>
            {calendar.length === 0 ? (
              renderEmptyState()
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📋 Calendrier vaccinal</Text>
                <FlatList
                  scrollEnabled={false}
                  data={calendar}
                  renderItem={renderCalendarItem}
                  keyExtractor={(item, index) =>
                    `${item.standard_vaccine_id}-${item.dose_number}-${index}`
                  }
                />
              </View>
            )}
          </View>
        )}

        {/* List Tab */}
        {activeTab === "list" && (
          <View>
            {calendar.length === 0 ? (
              renderEmptyState()
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  📝 Vaccinations enregistrées
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={calendar}
                  renderItem={renderVaccinationListItem}
                  keyExtractor={(item, index) => `vaccine-${item.id}-${index}`}
                />
              </View>
            )}
          </View>
        )}

        {/* Recommended Vaccinations */}
        {recommended.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💉 Vaccinations recommandées</Text>
            <FlatList
              scrollEnabled={false}
              data={recommended}
              renderItem={({ item }) => (
                <View style={styles.recommendedItem}>
                  <Text style={styles.recommendedVaccineName}>
                    {item.vaccine_name}
                  </Text>
                  <Text style={styles.recommendedAge}>
                    Âge recommandé: {item.recommended_age_months} mois
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#7f8c8d", fontSize: 14 },
  tabSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabButtonActive: { borderBottomColor: "#3498db" },
  tabButtonText: { fontSize: 13, fontWeight: "600", color: "#7f8c8d" },
  tabButtonActive: { color: "#3498db" },
  scrollContent: { padding: 20, paddingBottom: 30 },
  addButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
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
  calendarItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  calendarItemLeft: { flexDirection: "row", flex: 1 },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  calendarItemInfo: { flex: 1 },
  vaccineName: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  vaccineDetails: { fontSize: 12, color: "#7f8c8d", marginTop: 3 },
  vaccineDate: { fontSize: 11, color: "#3498db", marginTop: 2 },
  mandatory: {
    fontSize: 11,
    color: "#e74c3c",
    marginTop: 2,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: "600", color: "#7f8c8d" },
  listItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  listItemTitle: { flex: 1 },
  listItemName: { fontSize: 15, fontWeight: "bold", color: "#2c3e50" },
  listItemDose: { fontSize: 12, color: "#3498db", marginTop: 3 },
  deleteButton: { padding: 5 },
  deleteButtonText: { fontSize: 18 },
  listItemDetails: { marginBottom: 10 },
  detailRow: { flexDirection: "row", marginBottom: 6 },
  detailLabel: { fontSize: 12, color: "#7f8c8d", width: 70 },
  detailValue: { fontSize: 12, color: "#2c3e50", fontWeight: "500", flex: 1 },
  itemNotes: { fontSize: 12, color: "#7f8c8d", fontStyle: "italic" },
  recommendedItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  recommendedVaccineName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  recommendedAge: { fontSize: 12, color: "#7f8c8d", marginTop: 4 },
  emptyState: {
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
  emptyEmoji: { fontSize: 48, marginBottom: 15 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  emptyText: { fontSize: 14, color: "#95a5a6", textAlign: "center" },
});

export default VaccinationScreen;
