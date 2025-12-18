// baby-growth-app/src/screens/AddBabyScreen.js
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
import DatePickerField from "../components/DatePickerField";
import { babyService } from "../services/babyService";

export default function AddBabyScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    birth_date: new Date().toISOString().split("T")[0],
    gender: "male",
    birth_weight: "",
    birth_height: "",
    notes: "",
  });

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Erreur", "Le nom du bébé est requis");
      return false;
    }
    if (!form.birth_date) {
      Alert.alert("Erreur", "La date de naissance est requise");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await babyService.addBaby(form);

      if (result.success) {
        Alert.alert("Succès", "Bébé ajouté avec succès!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        let errorMessage = result.message || "Erreur lors de l'ajout";
        if (result.errors) {
          const firstError = Object.values(result.errors)[0][0];
          errorMessage = firstError;
        }
        Alert.alert("Erreur", errorMessage);
      }
    } catch (error) {
      console.error("Erreur ajout bébé:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Max date for birth date (today)
  const maxDate = new Date();
  // Min date (100 years ago - very conservative)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ajouter un bébé</Text>
          <Text style={styles.subtitle}>
            Remplissez les informations de votre bébé
          </Text>
        </View>

        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nom du bébé <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Lucas, Emma..."
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          {/* Date de naissance avec DatePickerField */}
          <View style={styles.inputGroup}>
            <DatePickerField
              label="Date de naissance"
              value={form.birth_date}
              onChange={(date) => setForm({ ...form, birth_date: date })}
              placeholder="Sélectionner une date..."
              hint="Tap to select from calendar"
              required={true}
              editable={!loading}
              minDate={minDate}
              maxDate={maxDate}
            />
          </View>

          {/* Genre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Genre <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.genderContainer}>
              {[
                { value: "male", label: "👦 Garçon" },
                { value: "female", label: "👧 Fille" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderButton,
                    form.gender === option.value && styles.genderButtonActive,
                  ]}
                  onPress={() => setForm({ ...form, gender: option.value })}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.genderText,
                      form.gender === option.value && styles.genderTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Poids et taille de naissance */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Poids de naissance (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 3.5"
                value={form.birth_weight}
                onChangeText={(text) =>
                  setForm({ ...form, birth_weight: text.replace(",", ".") })
                }
                keyboardType="decimal-pad"
                editable={!loading}
              />
              <Text style={styles.hint}>Optionnel (0.5 - 10 kg)</Text>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Taille de naissance (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 52"
                value={form.birth_height}
                onChangeText={(text) =>
                  setForm({ ...form, birth_height: text.replace(",", ".") })
                }
                keyboardType="decimal-pad"
                editable={!loading}
              />
              <Text style={styles.hint}>Optionnel (30 - 70 cm)</Text>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Allergies, particularités, antécédents familiaux..."
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              multiline
              numberOfLines={4}
              editable={!loading}
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {form.notes.length}/500 caractères
            </Text>
          </View>

          {/* Boutons */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Ajout en cours..." : "Ajouter le bébé"}
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
    textAlign: "center",
    lineHeight: 22,
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
  required: {
    color: "#e74c3c",
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#bdc3c7",
    textAlign: "right",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#fcfcfc",
  },
  genderButtonActive: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  genderText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  genderTextActive: {
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
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
    shadowColor: "transparent",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
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
