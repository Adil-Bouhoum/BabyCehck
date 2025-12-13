import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT : Utilisez l'IP réelle pour les tests sur téléphone physique
const API_BASE_URL = "http://192.168.1.162:8000/api";

console.log("🌐 API configurée sur:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 secondes pour connexions lentes
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        `🌐 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`
      );
      console.log("📦 Data:", config.data);

      return config;
    } catch (error) {
      console.error("❌ Erreur intercepteur request:", error);
      return config;
    }
  },
  (error) => {
    console.error("❌ Erreur avant envoi:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse ${response.status} de ${response.config.url}`);
    console.log("📥 Data reçue:", response.data);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Le serveur a répondu avec une erreur
      console.error(
        `❌ Erreur HTTP ${error.response.status}:`,
        error.response.data
      );

      if (error.response.status === 401) {
        await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
        console.log("🔓 Token expiré, déconnexion");
      }
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse
      console.error("❌ Pas de réponse du serveur");
      console.error("URL tentée:", error.config?.url);
      console.error("Base URL:", error.config?.baseURL);
    } else {
      // Erreur lors de la configuration
      console.error("❌ Erreur configuration:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
