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
  SafeAreaView,
} from "react-native";
import { authService } from "../services/auth";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Erreur", "L'email est requis");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide");
      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères"
      );
      return false;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        password_confirmation: passwordConfirmation,
      };

      const response = await authService.register(userData);

      Alert.alert("Succès", "Compte créé avec succès!", [
        {
          text: "OK",
          onPress: () => {
            navigation.replace("Dashboard");
          },
        },
      ]);
    } catch (error) {
      console.log("Registration error:", error);

      let errorMessage = "Échec de l'inscription";

      if (error.errors) {
        // Gestion des erreurs de validation Laravel
        const firstErrorKey = Object.keys(error.errors)[0];
        const firstError = error.errors[firstErrorKey][0];
        errorMessage = firstError;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Inscrivez-vous pour suivre la croissance de votre bébé
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum 8 caractères"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <Text style={styles.hint}>• 8 caractères minimum</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Répétez le mot de passe"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Création du compte..." : "S'inscrire"}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={goToLogin} disabled={loading}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                En vous inscrivant, vous acceptez nos conditions d'utilisation
                et notre politique de confidentialité.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#fcfcfc",
    color: "#333",
  },
  hint: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 6,
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
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
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  loginText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  loginLink: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  termsContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  termsText: {
    fontSize: 12,
    color: "#95a5a6",
    textAlign: "center",
    lineHeight: 18,
  },
});
