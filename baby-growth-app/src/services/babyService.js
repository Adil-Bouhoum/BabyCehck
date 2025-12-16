// baby-growth-app/src/services/babyService.js
import api from "./api";

export const babyService = {
  // Récupérer tous les bébés de l'utilisateur
  async getBabies() {
    try {
      const response = await api.get("/babies");
      return {
        success: true,
        babies: response.data.babies || [],
      };
    } catch (error) {
      console.error("❌ Erreur getBabies:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  // Ajouter un nouveau bébé
  async addBaby(babyData) {
    try {
      const response = await api.post("/babies", babyData);
      return {
        success: true,
        baby: response.data.baby,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur addBaby:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur lors de l'ajout",
      };
    }
  },

  // Récupérer les détails d'un bébé
  async getBabyDetails(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}`);
      return {
        success: true,
        baby: response.data.baby,
      };
    } catch (error) {
      console.error("❌ Erreur getBabyDetails:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  // Mettre à jour un bébé
  async updateBaby(babyId, babyData) {
    try {
      const response = await api.put(`/babies/${babyId}`, babyData);
      return {
        success: true,
        baby: response.data.baby,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur updateBaby:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur de mise à jour",
      };
    }
  },

  // Supprimer un bébé
  async deleteBaby(babyId) {
    try {
      await api.delete(`/babies/${babyId}`);
      return {
        success: true,
        message: "Bébé supprimé avec succès",
      };
    } catch (error) {
      console.error("❌ Erreur deleteBaby:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de suppression",
      };
    }
  },

  // Ajouter une mesure de croissance
  async addGrowthRecord(babyId, recordData) {
    try {
      const response = await api.post(
        `/babies/${babyId}/growth-records`,
        recordData
      );
      return {
        success: true,
        record: response.data.record,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur addGrowthRecord:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur lors de l'ajout",
      };
    }
  },

  // Récupérer l'historique des mesures
  async getGrowthRecords(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/growth-records`);
      return {
        success: true,
        records: response.data.records || [],
      };
    } catch (error) {
      console.error("❌ Erreur getGrowthRecords:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  // Ajouter un record médical (maladie/médicament)
  async addMedicalRecord(babyId, recordData) {
    try {
      const response = await api.post(
        `/babies/${babyId}/medical-records`,
        recordData
      );
      return {
        success: true,
        record: response.data.record,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur addMedicalRecord:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur lors de l'ajout",
      };
    }
  },

  // Récupérer l'historique médical
  async getMedicalRecords(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/medical-records`);
      return {
        success: true,
        records: response.data.records || [],
      };
    } catch (error) {
      console.error("❌ Erreur getMedicalRecords:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  // Ajouter un plan de repas
  async addMealPlan(babyId, mealData) {
    try {
      const response = await api.post(`/babies/${babyId}/meal-plans`, mealData);
      return {
        success: true,
        meal: response.data.meal,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur addMealPlan:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur lors de l'ajout",
      };
    }
  },

  // Récupérer les plans de repas
  async getMealPlans(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/meal-plans`);
      return {
        success: true,
        meals: response.data.meals || [],
      };
    } catch (error) {
      console.error("❌ Erreur getMealPlans:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },
};
