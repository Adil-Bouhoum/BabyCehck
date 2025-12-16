// baby-growth-app/src/screens/DashboardScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { authService } from "../services/auth";
import { babyService } from "../services/babyService";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
      await loadBabies();
    } catch (error) {
      console.error("❌ Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBabies = async () => {
    try {
      const result = await babyService.getBabies();
      if (result.success) {
        setBabies(result.babies);
      } else {
        Alert.alert(
          "Erreur",
          result.message || "Impossible de charger les bébés"
        );
      }
    } catch (error) {
      console.error("❌ Erreur chargement bébés:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBabies();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
            navigation.replace("Login");
          } catch (error) {
            console.error("❌ Erreur logout:", error);
            navigation.replace("Login");
          }
        },
      },
    ]);
  };

  const calculateAgeInMonths = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    return Math.max(0, months);
  };

  const formatAge = (months) => {
    if (months < 1) {
      return "Nouveau-né";
    } else if (months < 24) {
      return `${months} mois`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} an${years > 1 ? "s" : ""}`;
      }
      return `${years} an${years > 1 ? "s" : ""} ${remainingMonths} mois`;
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case "male":
        return "👦";
      case "female":
        return "👧";
      default:
        return "👶";
    }
  };

  const renderBabyItem = ({ item }) => {
    const ageInMonths = calculateAgeInMonths(item.birth_date);

    return (
      <TouchableOpacity
        style={styles.babyCard}
        onPress={() =>
          navigation.navigate("BabyDetail", {
            babyId: item.id,
            babyName: item.name,
          })
        }
      >
        <View style={styles.babyAvatar}>
          <Text style={styles.babyAvatarText}>
            {getGenderIcon(item.gender)}
          </Text>
        </View>

        <View style={styles.babyInfo}>
          <Text style={styles.babyName}>{item.name}</Text>
          <Text style={styles.babyDetails}>
            {item.gender === "male"
              ? "Garçon"
              : item.gender === "female"
              ? "Fille"
              : "Autre"}{" "}
            • {formatAge(ageInMonths)}
          </Text>
          {item.birth_weight && item.birth_height && (
            <Text style={styles.babyStats}>
              Naissance: {item.birth_weight}kg • {item.birth_height}cm
            </Text>
          )}
        </View>

        <View style={styles.babyArrow}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👋 Bonjour {user?.name || ""}!</Text>
          {user && (
            <View style={styles.userCard}>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}
        </View>

        {/* Section Bébés */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍼 Mes bébés</Text>
            <Text style={styles.babyCount}>({babies.length})</Text>
          </View>

          {babies.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👶</Text>
              <Text style={styles.emptyTitle}>Aucun bébé enregistré</Text>
              <Text style={styles.emptyText}>
                Commencez par ajouter votre premier bébé pour suivre sa
                croissance
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddBaby")}
              >
                <Text style={styles.addButtonText}>+ Ajouter un bébé</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={babies}
                renderItem={renderBabyItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={["#3498db"]}
                    tintColor="#3498db"
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />

              <TouchableOpacity
                style={styles.addButtonSmall}
                onPress={() => navigation.navigate("AddBaby")}
              >
                <Text style={styles.addButtonSmallText}>
                  + Ajouter un autre bébé
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Bouton Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🔓 Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#7f8c8d",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginRight: 10,
  },
  babyCount: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonSmall: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonSmallText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 10,
  },
  babyCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  babyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  babyAvatarText: {
    fontSize: 24,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  babyDetails: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  babyStats: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "500",
  },
  babyArrow: {
    marginLeft: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#bdc3c7",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
