import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

export default function TestConnectionScreen() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults((prev) => [...prev, { message, type, timestamp }]);
  };

  const testConnection = async () => {
    setTestResults([]);
    setLoading(true);
    addLog("🔍 Démarrage des tests...", "info");

    // Test 1 : Fetch basique
    try {
      addLog("Test 1 : Fetch natif vers /api/test", "info");

      const response = await fetch("http://192.168.1.162:8000/api/test", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Fetch OK: ${data.message}`, "success");
      } else {
        addLog(`❌ Fetch erreur ${response.status}`, "error");
      }
    } catch (error) {
      addLog(`❌ Fetch échoué: ${error.message}`, "error");
    }

    // Test 2 : POST avec données
    try {
      addLog("Test 2 : POST vers /api/register", "info");

      const testData = {
        name: "Test User",
        email: `test${Date.now()}@test.com`,
        password: "12345678",
        password_confirmation: "12345678",
      };

      const response = await fetch("http://192.168.1.162:8000/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const responseText = await response.text();
      addLog(`📥 Réponse brute: ${responseText.substring(0, 100)}`, "info");

      if (response.ok) {
        const data = JSON.parse(responseText);
        addLog(`✅ Register OK: Token reçu`, "success");
      } else {
        addLog(`❌ Register erreur ${response.status}`, "error");
      }
    } catch (error) {
      addLog(`❌ Register échoué: ${error.message}`, "error");
    }

    setLoading(false);
    addLog("✅ Tests terminés", "info");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Test de connexion</Text>
        <Text style={styles.subtitle}>
          Laravel API: http://192.168.1.162:8000
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={testConnection}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Test en cours..." : "🚀 Lancer les tests"}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.logContainer}>
        {testResults.map((result, index) => (
          <View
            key={index}
            style={[
              styles.logItem,
              result.type === "success" && styles.logSuccess,
              result.type === "error" && styles.logError,
            ]}
          >
            <Text style={styles.logTime}>{result.timestamp}</Text>
            <Text style={styles.logMessage}>{result.message}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  button: {
    backgroundColor: "#3498db",
    margin: 20,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logContainer: {
    flex: 1,
    padding: 15,
  },
  logItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  logSuccess: {
    borderLeftColor: "#2ecc71",
  },
  logError: {
    borderLeftColor: "#e74c3c",
  },
  logTime: {
    fontSize: 10,
    color: "#95a5a6",
    marginBottom: 5,
  },
  logMessage: {
    fontSize: 14,
    color: "#2c3e50",
  },
});
