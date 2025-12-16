// baby-growth-app/src/screens/EditBabyScreen.js
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
} from "react-native";
import { babyService } from "../services/babyService";

export default function EditBabyScreen({ navigation, route }) {
  const { baby } = route.params;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: baby.name || "",
    birth_date: baby.birth_date?.split("T")[0] || "",
    gender: baby.gender || "male",
    birth_weight: baby.birth_weight?.toString() || "",
    birth_height: baby.birth_height?.toString() || "",
    notes: baby.notes || "",
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

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await babyService.updateBaby(baby.id, form);

      if (result.success) {
        Alert.alert("Succès", "Bébé modifié avec succès!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(
          "Erreur",
          result.message || "Erreur lors de la modification"
        );
      }
    } catch (error) {
      console.error("Erreur modification bébé:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le bébé",
      `Êtes-vous sûr de vouloir supprimer ${baby.name} ?\n\nToutes les données associées (mesures, repas, etc.) seront également supprimées.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const result = await babyService.deleteBaby(baby.id);
              if (result.success) {
                Alert.alert("Succès", "Bébé supprimé avec succès", [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("Dashboard");
                    },
                  },
                ]);
              } else {
                Alert.alert("Erreur", result.message);
              }
            } catch (error) {
              console.error("Erreur suppression:", error);
              Alert.alert("Erreur", "Impossible de supprimer le bébé");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Modifier le bébé</Text>
          <Text style={styles.subtitle}>{baby.name}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du bébé *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Lucas, Emma..."
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              editable={!loading}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de naissance *</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-JJ"
              value={form.birth_date}
              onChangeText={(text) => setForm({ ...form, birth_date: text })}
              editable={!loading}
            />
            <Text style={styles.hint}>Format: AAAA-MM-JJ</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre *</Text>
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

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Poids naissance (kg)</Text>
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
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Taille naissance (cm)</Text>
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
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Allergies, particularités..."
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              multiline
              numberOfLines={4}
              editable={!loading}
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Modification..." : "Enregistrer les modifications"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>🗑️ Supprimer le bébé</Text>
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
  hint: { fontSize: 12, color: "#95a5a6", marginTop: 5, marginLeft: 5 },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  genderContainer: { flexDirection: "row", justifyContent: "space-between" },
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
  genderButtonActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  genderText: { fontSize: 14, color: "#7f8c8d", fontWeight: "500" },
  genderTextActive: { color: "white", fontWeight: "600" },
  submitButton: {
    backgroundColor: "#3498db",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: { backgroundColor: "#bdc3c7" },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  deleteButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: { padding: 15, alignItems: "center" },
  cancelButtonText: { color: "#7f8c8d", fontSize: 16, fontWeight: "500" },
});
