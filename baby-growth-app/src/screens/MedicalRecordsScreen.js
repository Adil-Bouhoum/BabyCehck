// baby-growth-app/src/screens/MedicalRecordsScreen.js
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

const MedicalRecordsScreen = ({ route, navigation }) => {
  const { babyId, babyName } = route.params;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const loadMedicalRecords = async () => {
    setLoading(true);
    try {
      const result = await babyService.getMedicalRecords(babyId);
      if (result.success) {
        setRecords(result.records || []);
      } else {
        Alert.alert("Erreur", "Impossible de charger les dossiers médicaux");
      }
    } catch (error) {
      console.error("Erreur chargement records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "#2ecc71";
      case "ongoing":
        return "#f39c12";
      case "chronic":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "resolved":
        return "✅ Résolu";
      case "ongoing":
        return "⏳ En cours";
      case "chronic":
        return "⚠️ Chronique";
      default:
        return status;
    }
  };

  const handleAddRecord = () => {
    navigation.navigate("AddMedicalRecord", {
      babyId,
      babyName,
      onRecordAdded: loadMedicalRecords,
    });
  };

  const handleDeleteRecord = (recordId) => {
    Alert.alert(
      "Supprimer le dossier",
      "Êtes-vous sûr de vouloir supprimer ce dossier ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await babyService.deleteMedicalRecord(
                babyId,
                recordId
              );
              if (result.success) {
                Alert.alert("Succès", "Dossier supprimé");
                loadMedicalRecords();
              } else {
                Alert.alert("Erreur", "Impossible de supprimer");
              }
            } catch (error) {
              console.error("Erreur suppression:", error);
            }
          },
        },
      ]
    );
  };

  const renderMedicalRecord = ({ item }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordHeaderLeft}>
          <Text style={styles.recordCondition}>{item.condition}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteRecord(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recordDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Diagnostic:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.diagnosis_date).toLocaleDateString("fr-FR")}
          </Text>
        </View>

        {item.medication && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Médicament:</Text>
            <Text style={styles.detailValue}>{item.medication}</Text>
          </View>
        )}

        {item.dosage && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posologie:</Text>
            <Text style={styles.detailValue}>{item.dosage}</Text>
          </View>
        )}
      </View>

      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>📝 Notes:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
          <Text style={styles.addButtonText}>+ Ajouter un dossier médical</Text>
        </TouchableOpacity>

        {/* Records List */}
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏥</Text>
            <Text style={styles.emptyTitle}>Aucun dossier médical</Text>
            <Text style={styles.emptyText}>
              Enregistrez les maladies et traitements de votre bébé
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏥 Historique médical</Text>
            <FlatList
              scrollEnabled={false}
              data={records}
              renderItem={renderMedicalRecord}
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
  recordCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#e74c3c",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recordHeaderLeft: { flex: 1 },
  recordCondition: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, fontWeight: "600", color: "white" },
  deleteButton: { padding: 5 },
  deleteButtonText: { fontSize: 18 },
  recordDetails: { marginBottom: 12 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  detailLabel: { fontSize: 13, color: "#7f8c8d", fontWeight: "500" },
  detailValue: {
    fontSize: 13,
    color: "#2c3e50",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  notesSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  notesText: { fontSize: 12, color: "#7f8c8d", lineHeight: 18 },
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

export default MedicalRecordsScreen;
