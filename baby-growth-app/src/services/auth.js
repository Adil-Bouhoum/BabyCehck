import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  // Inscription
  async register(userData) {
    try {
      console.log("📤 Envoi inscription:", userData.email);

      const response = await api.post("/register", userData);

      console.log("📥 Réponse reçue:", response.data);

      if (response.data.token) {
        await this.saveToken(response.data.token);
        await this.saveUser(response.data.user);
        console.log("✅ Inscription réussie");
        return { success: true, data: response.data };
      }

      return { success: false, message: "Aucun token reçu" };
    } catch (error) {
      console.error("❌ Erreur inscription:", error.message);

      if (error.response) {
        // Erreur HTTP du serveur
        throw error.response.data;
      } else if (error.request) {
        // Pas de réponse du serveur
        throw { message: "Impossible de contacter le serveur" };
      } else {
        // Erreur de configuration
        throw { message: error.message };
      }
    }
  },

  // Connexion
  async login(email, password) {
    try {
      console.log("🔐 Tentative de connexion:", email);

      const response = await api.post("/login", { email, password });

      console.log("📥 Réponse login:", response.data);

      if (response.data.token) {
        await this.saveToken(response.data.token);
        await this.saveUser(response.data.user);
        console.log("✅ Connexion réussie");
        return { success: true, data: response.data };
      }

      return { success: false, message: "Aucun token reçu" };
    } catch (error) {
      console.error("❌ Erreur login:", error.message);

      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: "Impossible de contacter le serveur" };
      } else {
        throw { message: error.message };
      }
    }
  },

  // Déconnexion
  async logout() {
    try {
      console.log("🔓 Déconnexion...");
      await api.post("/logout");
    } catch (error) {
      console.warn("⚠️ Erreur logout API:", error.message);
    } finally {
      await this.clearAuthData();
      console.log("✅ Données d'authentification supprimées");
    }
  },

  // Sauvegarde du token
  async saveToken(token) {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Token invalide");
      }

      await AsyncStorage.setItem("@auth_token", token.trim());
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("💾 Token sauvegardé");
    } catch (error) {
      console.error("❌ Erreur sauvegarde token:", error);
      throw error;
    }
  },

  // Récupération du token
  async getToken() {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      return token ? token.trim() : null;
    } catch (error) {
      console.error("❌ Erreur récupération token:", error);
      return null;
    }
  },

  // Sauvegarde de l'utilisateur
  async saveUser(user) {
    try {
      if (!user || typeof user !== "object") {
        throw new Error("Données utilisateur invalides");
      }

      await AsyncStorage.setItem("@auth_user", JSON.stringify(user));
      console.log("💾 Utilisateur sauvegardé:", user.name);
    } catch (error) {
      console.error("❌ Erreur sauvegarde user:", error);
      throw error;
    }
  },

  // Récupération de l'utilisateur
  async getUser() {
    try {
      const userJson = await AsyncStorage.getItem("@auth_user");
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("❌ Erreur récupération user:", error);
      return null;
    }
  },

  // Suppression des données d'authentification
  async clearAuthData() {
    try {
      await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("❌ Erreur nettoyage données:", error);
    }
  },

  // Vérification si connecté
  async isLoggedIn() {
    try {
      const token = await this.getToken();
      return token && typeof token === "string" && token.trim().length > 0;
    } catch (error) {
      console.error("❌ Erreur isLoggedIn:", error);
      return false;
    }
  },

  // Initialisation au démarrage
  async initialize() {
    try {
      const token = await this.getToken();

      if (token && typeof token === "string" && token.trim().length > 10) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("✅ Session restaurée");
        return true;
      }

      console.log("ℹ️ Aucune session active");
      return false;
    } catch (error) {
      console.error("❌ Erreur initialisation:", error);
      return false;
    }
  },
};
