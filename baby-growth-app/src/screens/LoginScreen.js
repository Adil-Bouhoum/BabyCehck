import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { authService } from "../services/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation des champs
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide");
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Tentative de connexion...");

      const result = await authService.login(email.trim(), password);

      if (result.success) {
        console.log("✅ Connexion réussie!");
        Alert.alert("Succès", "Connexion réussie!", [
          {
            text: "OK",
            onPress: () => navigation.replace("Dashboard"),
          },
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Échec de connexion");
      }
    } catch (error) {
      console.error("❌ Erreur login:", error);

      let errorMessage = "Échec de connexion";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors) {
        // Erreurs de validation Laravel
        const firstErrorKey = Object.keys(error.errors)[0];
        errorMessage = error.errors[firstErrorKey][0];
      }

      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>BabyCheck</Text>
          <Text style={styles.subtitle}>Suivi de croissance du bébé</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Connexion..." : "Se connecter"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={goToRegister}
            disabled={loading}
          >
            <Text style={styles.registerText}>Pas de compte ? S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
  },
  registerText: {
    color: "#3498db",
    fontSize: 14,
  },
});
