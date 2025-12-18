// baby-growth-app/src/screens/AddVaccinationScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Switch,
  FlatList,
  Modal,
} from "react-native";
import { babyService } from "../services/babyService";

// Standard vaccines list (from backend)
const STANDARD_VACCINES = [
  { id: 1, name: "BCG", doses: 1 },
  { id: 2, name: "Hexavalent (6-en-1)", doses: 3 },
  { id: 3, name: "Pneumocoque", doses: 4 },
  { id: 4, name: "Poliomyélite", doses: 4 },
  { id: 5, name: "Rougeole-Oreillons-Rubéole (ROR)", doses: 2 },
  { id: 6, name: "Varicelle", doses: 2 },
  { id: 7, name: "Méningocoque C", doses: 2 },
  { id: 8, name: "Grippe", doses: 1 },
  { id: 9, name: "Coqueluche (rappel)", doses: 1 },
];

export default function AddVaccinationScreen({ navigation, route }) {
  const { babyId, babyName, onVaccinationAdded } = route.params;
  const [loading, setLoading] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [isCustom, setIsCustom] = useState(false);

  const [form, setForm] = useState({
    vaccine_name: "",
    vaccination_date: new Date().toISOString().split("T")[0],
    due_date: "",
    dose_number: "1",
    status: "completed",
    notes: "",
    lot_number: "",
    clinic: "",
    standard_vaccine_id: null,
  });

  const validateForm = () => {
    if (!form.vaccine_name.trim()) {
      Alert.alert("Erreur", "Le nom du vaccin est requis");
      return false;
    }
    if (!form.vaccination_date && !isCustom) {
      Alert.alert("Erreur", "La date de vaccination est requise");
      return false;
    }
    return true;
  };

  const handleSelectVaccine = (vaccine) => {
    setSelectedVaccine(vaccine);
    setForm({
      ...form,
      vaccine_name: vaccine.name,
      standard_vaccine_id: vaccine.id,
    });
    setShowVaccineModal(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;

      if (selectedVaccine && !isCustom) {
        // Standard vaccination
        result = await babyService.addStandardVaccination(babyId, {
          standard_vaccine_id: form.standard_vaccine_id,
          vaccination_date: form.vaccination_date,
          dose_number: parseInt(form.dose_number),
          notes: form.notes,
        });
      } else {
        // Custom vaccination
        result = await babyService.addCustomVaccination(babyId, {
          vaccine_name: form.vaccine_name,
          vaccination_date: form.vaccination_date,
          due_date: form.due_date,
          status: form.status,
          notes: form.notes,
        });
      }

      if (result.success) {
        Alert.alert("Succès", "Vaccination ajoutée avec succès!", [
          {
            text: "OK",
            onPress: () => {
              if (onVaccinationAdded) onVaccinationAdded();
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur ajout vaccination:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>💉 Nouvelle vaccination</Text>
          <Text style={styles.subtitle}>Pour {babyName}</Text>
        </View>

        <View style={styles.form}>
          {/* Toggle: Standard vs Custom */}
          <View style={styles.toggleGroup}>
            <Text style={styles.toggleLabel}>Type de vaccin:</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !isCustom && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  setIsCustom(false);
                  setSelectedVaccine(null);
                  setForm({
                    ...form,
                    vaccine_name: "",
                    standard_vaccine_id: null,
                  });
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !isCustom && styles.toggleTextActive,
                  ]}
                >
                  Standard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isCustom && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  setIsCustom(true);
                  setSelectedVaccine(null);
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isCustom && styles.toggleTextActive,
                  ]}
                >
                  Personnalisé
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Standard Vaccine Selector */}
          {!isCustom && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vaccin *</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowVaccineModal(true)}
              >
                <Text style={styles.selectButtonText}>
                  {selectedVaccine
                    ? selectedVaccine.name
                    : "Sélectionner un vaccin..."}
                </Text>
                <Text style={styles.selectButtonArrow}>›</Text>
              </TouchableOpacity>

              {selectedVaccine && (
                <View style={styles.doseSelector}>
                  <Text style={styles.doseLabel}>Numéro de dose:</Text>
                  <View style={styles.dosesContainer}>
                    {Array.from(
                      { length: selectedVaccine.doses },
                      (_, i) => i + 1
                    ).map((doseNum) => (
                      <TouchableOpacity
                        key={doseNum}
                        style={[
                          styles.doseButton,
                          form.dose_number === doseNum.toString() &&
                            styles.doseButtonActive,
                        ]}
                        onPress={() =>
                          setForm({
                            ...form,
                            dose_number: doseNum.toString(),
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.doseButtonText,
                            form.dose_number === doseNum.toString() &&
                              styles.doseButtonTextActive,
                          ]}
                        >
                          {doseNum}/{selectedVaccine.doses}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Custom Vaccine Name */}
          {isCustom && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom du vaccin *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Vaccin spécial..."
                value={form.vaccine_name}
                onChangeText={(text) =>
                  setForm({ ...form, vaccine_name: text })
                }
                editable={!loading}
                maxLength={100}
              />
            </View>
          )}

          {/* Vaccination Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de vaccination *</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-JJ"
              value={form.vaccination_date}
              onChangeText={(text) =>
                setForm({ ...form, vaccination_date: text })
              }
              editable={!loading}
            />
            <Text style={styles.hint}>Format: AAAA-MM-JJ (ex: 2024-12-16)</Text>
          </View>

          {/* Due Date (Custom only) */}
          {isCustom && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prochaine dose (optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-JJ"
                value={form.due_date}
                onChangeText={(text) => setForm({ ...form, due_date: text })}
                editable={!loading}
              />
              <Text style={styles.hint}>
                Date prévue pour la prochaine dose
              </Text>
            </View>
          )}

          {/* Status (Custom only) */}
          {isCustom && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Statut *</Text>
              <View style={styles.statusContainer}>
                {[
                  { value: "completed", label: "✅ Effectué" },
                  { value: "scheduled", label: "📅 Programmé" },
                  { value: "overdue", label: "⚠️ En retard" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusButton,
                      form.status === option.value && styles.statusButtonActive,
                    ]}
                    onPress={() => setForm({ ...form, status: option.value })}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        form.status === option.value &&
                          styles.statusButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Lot Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Numéro de lot (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: ABC123456"
              value={form.lot_number}
              onChangeText={(text) => setForm({ ...form, lot_number: text })}
              editable={!loading}
              maxLength={50}
            />
          </View>

          {/* Clinic */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lieu (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Hôpital Saint-Louis, Pharmacie..."
              value={form.clinic}
              onChangeText={(text) => setForm({ ...form, clinic: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Bonne tolérance, observations..."
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              multiline
              numberOfLines={3}
              editable={!loading}
              maxLength={300}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Ajout en cours..." : "Enregistrer la vaccination"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Vaccine Selection Modal */}
      <Modal
        visible={showVaccineModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVaccineModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un vaccin</Text>
              <TouchableOpacity onPress={() => setShowVaccineModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={STANDARD_VACCINES}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.vaccineOption}
                  onPress={() => handleSelectVaccine(item)}
                >
                  <View>
                    <Text style={styles.vaccineOptionName}>{item.name}</Text>
                    <Text style={styles.vaccineOptionDoses}>
                      {item.doses} dose{item.doses > 1 ? "s" : ""}
                    </Text>
                  </View>
                  <Text style={styles.vaccineOptionArrow}>›</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: "#7f8c8d" },
  form: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  toggleGroup: { marginBottom: 25 },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  toggleContainer: { flexDirection: "row", justifyContent: "space-between" },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fcfcfc",
  },
  toggleButtonActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  toggleText: { fontSize: 13, color: "#7f8c8d", fontWeight: "500" },
  toggleTextActive: { color: "white", fontWeight: "600" },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#2c3e50", marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fcfcfc",
    color: "#333",
  },
  selectButton: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fcfcfc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: { fontSize: 16, color: "#333", fontWeight: "500" },
  selectButtonArrow: { fontSize: 20, color: "#3498db" },
  hint: { fontSize: 12, color: "#95a5a6", marginTop: 5, marginLeft: 5 },
  doseSelector: { marginTop: 15 },
  doseLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  dosesContainer: { flexDirection: "row", flexWrap: "wrap" },
  doseButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#fcfcfc",
  },
  doseButtonActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  doseButtonText: { fontSize: 12, color: "#7f8c8d", fontWeight: "500" },
  doseButtonTextActive: { color: "white", fontWeight: "600" },
  statusContainer: { flexDirection: "row", flexWrap: "wrap" },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 10,
    backgroundColor: "#fcfcfc",
  },
  statusButtonActive: { backgroundColor: "#2ecc71", borderColor: "#2ecc71" },
  statusButtonText: { fontSize: 11, color: "#7f8c8d", fontWeight: "500" },
  statusButtonTextActive: { color: "white", fontWeight: "600" },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  submitButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: { backgroundColor: "#bdc3c7" },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: { padding: 15, alignItems: "center" },
  cancelButtonText: { color: "#e74c3c", fontSize: 16, fontWeight: "500" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  modalClose: { fontSize: 24, color: "#95a5a6" },
  vaccineOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  vaccineOptionName: { fontSize: 15, fontWeight: "600", color: "#2c3e50" },
  vaccineOptionDoses: { fontSize: 12, color: "#7f8c8d", marginTop: 4 },
  vaccineOptionArrow: { fontSize: 20, color: "#3498db" },
});
