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
  FlatList,
} from "react-native";

// Components
import VaccinationStatusModal from "../components/VaccinationStatusModal";
import VaccinationCalendarItem from "../components/VaccinationCalendarItem";
import VaccinationListItem from "../components/VaccinationListItem";

// Hooks
import { useVaccinationLogic } from "../hooks/useVaccinationLogic";

// Utils
import {
  getStatusColor,
  getStatusLabel,
  formatStatusUpdateData,
  validateStatusForm,
  initializeStatusForm,
  resetStatusForm,
} from "../utils/vaccinationUtils";

const VaccinationScreen = ({ route, navigation }) => {
  const { babyId, babyName } = route.params;

  // Vaccination logic
  const {
    calendar,
    recommended,
    loading,
    updating,
    loadVaccinationData,
    updateVaccinationStatus,
    deleteVaccination,
  } = useVaccinationLogic(babyId);

  // Modal state
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [statusForm, setStatusForm] = useState(resetStatusForm());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("vaccination_date");

  // UI state
  const [activeTab, setActiveTab] = useState("calendar");

  // Load data on mount
  useEffect(() => {
    loadVaccinationData();
  }, []);

  /**
   * Open status modal for a vaccination
   */
  const openStatusModal = (vaccination) => {
    setSelectedVaccination(vaccination);
    setStatusForm(initializeStatusForm(vaccination));
    setStatusModalVisible(true);
  };

  /**
   * Close status modal and reset
   */
  const closeStatusModal = () => {
    setStatusModalVisible(false);
    setSelectedVaccination(null);
    setStatusForm(resetStatusForm());
  };

  /**
   * Handle status change
   */
  const handleStatusChange = (newStatus) => {
    setStatusForm({ ...statusForm, status: newStatus });
  };

  /**
   * Handle notes change
   */
  const handleNotesChange = (text) => {
    setStatusForm({ ...statusForm, notes: text });
  };

  /**
   * Handle date picker open
   */
  const handleDatePress = (type) => {
    setDatePickerType(type);
    setShowDatePicker(true);
  };

  /**
   * Handle date change from picker
   */
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      setStatusForm({
        ...statusForm,
        [datePickerType]: dateString,
      });
    }
  };

  /**
   * Handle confirm status update
   */
  const handleConfirm = async () => {
    const validation = validateStatusForm(statusForm);
    if (!validation.valid) {
      Alert.alert("Erreur", validation.error);
      return;
    }

    const updateData = formatStatusUpdateData(statusForm);
    const result = await updateVaccinationStatus(
      selectedVaccination,
      updateData
    );

    if (result.success) {
      closeStatusModal();
    }
  };

  /**
   * Render calendar items
   */
  const renderCalendarItem = ({ item }) => (
    <VaccinationCalendarItem
      item={item}
      onStatusPress={openStatusModal}
      getStatusColor={getStatusColor}
      getStatusLabel={getStatusLabel}
    />
  );

  /**
   * Render list items
   */
  const renderListItem = ({ item }) => (
    <VaccinationListItem
      item={item}
      onEditPress={openStatusModal}
      onDeletePress={deleteVaccination}
      getStatusColor={getStatusColor}
      getStatusLabel={getStatusLabel}
    />
  );

  /**
   * Render empty state
   */
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
      {/* Tabs */}
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
        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddVaccination", {
              babyId,
              babyName,
              onVaccinationAdded: loadVaccinationData,
            })
          }
        >
          <Text style={styles.addButtonText}>+ Ajouter une vaccination</Text>
        </TouchableOpacity>

        {/* Calendar View */}
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
                    item.id
                      ? `calendar-${item.id}`
                      : `calendar-${item.vaccine_id || "custom"}-${
                          item.dose_number
                        }-${index}`
                  }
                />
              </View>
            )}
          </View>
        )}

        {/* List View */}
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
                  renderItem={renderListItem}
                  keyExtractor={(item, index) =>
                    item.id
                      ? `list-${item.id}`
                      : `list-${item.vaccine_id || "custom"}-${
                          item.dose_number
                        }-${index}`
                  }
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

      {/* Status Modal */}
      <VaccinationStatusModal
        visible={statusModalVisible}
        vaccination={selectedVaccination}
        statusForm={statusForm}
        updating={updating}
        showDatePicker={showDatePicker}
        datePickerType={datePickerType}
        onStatusChange={handleStatusChange}
        onNotesChange={handleNotesChange}
        onDatePress={handleDatePress}
        onDateChange={handleDateChange}
        onConfirm={handleConfirm}
        onCancel={closeStatusModal}
      />
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
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7f8c8d",
  },
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
