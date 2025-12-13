import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

export default function TestScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const testLaravel = async () => {
    setLoading(true);
    try {
      // REMPLACE 192.168.1.10 par ton IP locale (taper ipconfig dans cmd)
      const response = await axios.get("http://192.168.1.162:8000/api/test");
      setResult(JSON.stringify(response.data, null, 2));
      Alert.alert("Succès", "Connexion à Laravel réussie!");
    } catch (error) {
      setResult("Erreur: " + error.message);
      Alert.alert("Erreur", "Impossible de se connecter à Laravel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BabyCheck - Test API</Text>
      <Text style={styles.subtitle}>Test de connexion Laravel</Text>

      <Button
        title={loading ? "Test en cours..." : "Tester Laravel"}
        onPress={testLaravel}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Résultat :</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Instructions :</Text>
        <Text>1. Laravel doit tourner sur port 8000</Text>
        <Text>2. PC et téléphone sur même Wi-Fi</Text>
        <Text>3. IP correcte dans le code (voir ci-dessous)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#7f8c8d",
  },
  loader: {
    marginTop: 20,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2c3e50",
  },
  resultText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  instructions: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e8f4fc",
    borderRadius: 8,
  },
  instructionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2980b9",
  },
});
