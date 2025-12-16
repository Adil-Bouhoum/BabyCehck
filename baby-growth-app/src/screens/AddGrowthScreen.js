// baby-growth-app/src/screens/AddGrowthScreen.js
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

export default function AddGrowthScreen({ navigation, route }) {
  const { babyId, babyName } = route.params;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    measurement_date: new Date().toISOString().split("T")[0],
    weight: "",
    height: "",
    head_circumference: "",
    notes: "",
  });

  const validateForm = () => {
    if (!form.weight || !form.height) {
      Alert.alert("Erreur", "Poids et taille sont requis");
      return false;
    }
    if (parseFloat(form.weight) <= 0 || parseFloat(form.height) <= 0) {
      Alert.alert("Erreur", "Les valeurs doivent être positives");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await babyService.addGrowthRecord(babyId, {
        ...form,
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        head_circumference: form.head_circumference
          ? parseFloat(form.head_circumference)
          : null,
      });

      if (result.success) {
        Alert.alert("Succès", "Mesure ajoutée avec succès!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur ajout mesure:", error);
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
          <Text style={styles.title}>📏 Nouvelle mesure</Text>
          <Text style={styles.subtitle}>Pour {babyName}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de mesure *</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-JJ"
              value={form.measurement_date}
              onChangeText={(text) =>
                setForm({ ...form, measurement_date: text })
              }
              editable={!loading}
            />
            <Text style={styles.hint}>Format: AAAA-MM-JJ (ex: 2024-12-16)</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Poids (kg) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 6.5"
                value={form.weight}
                onChangeText={(text) =>
                  setForm({ ...form, weight: text.replace(",", ".") })
                }
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Taille (cm) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 65"
                value={form.height}
                onChangeText={(text) =>
                  setForm({ ...form, height: text.replace(",", ".") })
                }
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Périmètre crânien (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 42.5 (optionnel)"
              value={form.head_circumference}
              onChangeText={(text) =>
                setForm({ ...form, head_circumference: text.replace(",", ".") })
              }
              keyboardType="decimal-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Contrôle mensuel, observations..."
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              multiline
              numberOfLines={3}
              editable={!loading}
              maxLength={300}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Ajout en cours..." : "Enregistrer la mesure"}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
