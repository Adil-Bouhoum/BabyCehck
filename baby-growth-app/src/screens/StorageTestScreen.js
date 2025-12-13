import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StorageTestScreen() {
  const [storageStatus, setStorageStatus] = useState("Testing...");

  useEffect(() => {
    testStorage();
  }, []);

  const testStorage = async () => {
    try {
      // Test 1: Écrire une valeur
      await AsyncStorage.setItem("@test_key", "test_value");

      // Test 2: Lire la valeur
      const value = await AsyncStorage.getItem("@test_key");

      // Test 3: Écrire un booléen (comme string)
      await AsyncStorage.setItem("@test_bool", "true");
      const boolValue = await AsyncStorage.getItem("@test_bool");

      // Test 4: Vérifier le type
      console.log("Test value:", value, "Type:", typeof value);
      console.log("Bool value:", boolValue, "Type:", typeof boolValue);

      setStorageStatus(`✅ Storage OK\nValue: ${value}\nBool: ${boolValue}`);
    } catch (error) {
      console.error("Storage test error:", error);
      setStorageStatus(`❌ Error: ${error.message}`);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setStorageStatus("✅ Storage cleared");
    } catch (error) {
      setStorageStatus(`❌ Clear error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Test</Text>
      <Text style={styles.status}>{storageStatus}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Test Storage" onPress={testStorage} />
        <View style={styles.spacer} />
        <Button title="Clear Storage" onPress={clearStorage} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  status: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#7f8c8d",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "60%",
  },
  spacer: {
    height: 15,
  },
});
