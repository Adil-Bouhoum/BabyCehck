// baby-growth-app/src/screens/AddMedicalRecordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { babyService } from "../services/babyService";

export default function AddMedicalRecordScreen({ navigation, route }) {
  const { babyId, babyName, onRecordAdded } = route.params;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    condition: "",
    diagnosis_date: new Date().toISOString().split("T")[0],
    medication: "",
    dosage: "",
    status: "ongoing",
    notes: "",
  });

  const STATUS_OPTIONS = [
    { value: "resolved", label: "✅ Résolu" },
    { value: "ongoing", label: "⏳ En cours" },
    { value: "chronic", label: "⚠️ Chronique" },
  ];

  const validateForm = () => {
    if (!form.condition.trim()) {
      Alert.alert("Erreur", "Le nom de la condition est requis");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await babyService.addMedicalRecord(babyId, form);

      if (result.success) {
        Alert.alert("Succès", "Dossier médical ajouté avec succès!", [
          {
            text: "OK",
            onPress: () => {
              if (onRecordAdded) onRecordAdded();
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur ajout record:", error);
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
          <Text style={styles.title}>🏥 Nouveau dossier médical</Text>
          <Text style={styles.subtitle}>Pour {babyName}</Text>
        </View>

        <View style={styles.form}>
          {/* Condition */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condition / Maladie *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Otite, Gastro-entérite, Eczéma..."
              value={form.condition}
              onChangeText={(text) => setForm({ ...form, condition: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          {/* Diagnosis Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date du diagnostic *</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-JJ"
              value={form.diagnosis_date}
              onChangeText={(text) =>
                setForm({ ...form, diagnosis_date: text })
              }
              editable={!loading}
            />
            <Text style={styles.hint}>Format: AAAA-MM-JJ (ex: 2024-12-16)</Text>
          </View>

          {/* Status */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Statut *</Text>
            <View style={styles.statusContainer}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusButton,
                    form.status === option.value && styles.statusButtonActive,
                  ]}
                  onPress={() => setForm({ ...form, status: option.value })}
                  disabled={loading}
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

          {/* Medication */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Médicament (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Amoxicilline, Doliprane..."
              value={form.medication}
              onChangeText={(text) => setForm({ ...form, medication: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          {/* Dosage */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Posologie (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 250mg 2x/jour, 15mg/kg..."
              value={form.dosage}
              onChangeText={(text) => setForm({ ...form, dosage: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Fièvre 39°C, effets secondaires, observations..."
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              multiline
              numberOfLines={4}
              editable={!loading}
              maxLength={500}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Ajout en cours..." : "Enregistrer le dossier"}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fcfcfc",
    color: "#333",
  },
  hint: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 5,
    marginLeft: 5,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
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
  statusButtonActive: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
  },
  statusButtonText: {
    fontSize: 11,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  statusButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "500",
  },
});
