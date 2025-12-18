// baby-growth-app/src/screens/AddMealScreen.js
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
import DatePickerField from "../components/DatePickerField";
export default function AddMealScreen({ navigation, route }) {
  const { babyId, babyName } = route.params;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    meal_date: new Date().toISOString().split("T")[0],
    meal_type: "breakfast",
    food_name: "",
    quantity: "",
    notes: "",
  });

  const MEAL_TYPES = [
    { value: "breakfast", label: "🌅 Petit-déjeuner", emoji: "🌅" },
    { value: "lunch", label: "☀️ Déjeuner", emoji: "☀️" },
    { value: "snack", label: "🍪 Goûter", emoji: "🍪" },
    { value: "dinner", label: "🌙 Dîner", emoji: "🌙" },
  ];

  const validateForm = () => {
    if (!form.food_name.trim()) {
      Alert.alert("Erreur", "Le nom de l'aliment est requis");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await babyService.addMealPlan(babyId, form);

      if (result.success) {
        Alert.alert("Succès", "Repas ajouté avec succès!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur ajout repas:", error);
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
          <Text style={styles.title}>🍎 Nouveau repas</Text>
          <Text style={styles.subtitle}>Pour {babyName}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <DatePickerField
              label="Date"
              value={form.meal_date}
              onChange={(date) => setForm({ ...form, meal_date: date })}
              placeholder="Sélectionner une date..."
              required={true}
              editable={!loading}
              maxDate={new Date()} // Can't add meals in the future
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type de repas *</Text>
            <View style={styles.mealTypeContainer}>
              {MEAL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.mealTypeButton,
                    form.meal_type === type.value &&
                      styles.mealTypeButtonActive,
                  ]}
                  onPress={() => setForm({ ...form, meal_type: type.value })}
                  disabled={loading}
                >
                  <Text style={styles.mealTypeEmoji}>{type.emoji}</Text>
                  <Text
                    style={[
                      styles.mealTypeText,
                      form.meal_type === type.value &&
                        styles.mealTypeTextActive,
                    ]}
                  >
                    {type.value === "breakfast"
                      ? "P.Déj"
                      : type.value === "lunch"
                      ? "Déj"
                      : type.value === "snack"
                      ? "Goûter"
                      : "Dîner"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aliment / Plat *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Purée de carotte, Compote pomme..."
              value={form.food_name}
              onChangeText={(text) => setForm({ ...form, food_name: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantité</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 150g, 200ml... (optionnel)"
              value={form.quantity}
              onChangeText={(text) => setForm({ ...form, quantity: text })}
              editable={!loading}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: A bien mangé, allergies, observations..."
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
              {loading ? "Ajout en cours..." : "Enregistrer le repas"}
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
  mealTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#fcfcfc",
  },
  mealTypeButtonActive: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  mealTypeEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },
  mealTypeText: {
    fontSize: 11,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  mealTypeTextActive: {
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
