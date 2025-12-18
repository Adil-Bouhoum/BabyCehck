// baby-growth-app/src/services/babyService.js
import api from "./api";

export const babyService = {
  // ============= BABIES =============
  async getBabies() {
    try {
      const response = await api.get("/babies");
      return {
        success: true,
        babies: response.data.data || response.data.babies || [],
      };
    } catch (error) {
      console.error("❌ Erreur getBabies:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async addBaby(babyData) {
    try {
      const response = await api.post("/babies", babyData);
      return {
        success: true,
        baby: response.data.data || response.data.baby,
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

  async getBabyDetails(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}`);
      return {
        success: true,
        baby: response.data.data || response.data.baby,
      };
    } catch (error) {
      console.error("❌ Erreur getBabyDetails:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async updateBaby(babyId, babyData) {
    try {
      const response = await api.put(`/babies/${babyId}`, babyData);
      return {
        success: true,
        baby: response.data.data || response.data.baby,
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

  // ============= GROWTH RECORDS =============
  async addGrowthRecord(babyId, recordData) {
    try {
      const response = await api.post(
        `/babies/${babyId}/growth-records`,
        recordData
      );
      return {
        success: true,
        record: response.data.data || response.data.record,
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

  async getGrowthRecords(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/growth-records`);
      return {
        success: true,
        records: response.data.data || response.data.records || [],
      };
    } catch (error) {
      console.error("❌ Erreur getGrowthRecords:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async deleteGrowthRecord(babyId, recordId) {
    try {
      await api.delete(`/babies/${babyId}/growth-records/${recordId}`);
      return {
        success: true,
        message: "Mesure supprimée avec succès",
      };
    } catch (error) {
      console.error("❌ Erreur deleteGrowthRecord:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de suppression",
      };
    }
  },

  // ============= VACCINATIONS =============
  async getVaccinationCalendar(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/vaccinations/calendar`);
      return {
        success: true,
        calendar: response.data.data?.calendar || response.data.calendar || [],
      };
    } catch (error) {
      console.error("❌ Erreur getVaccinationCalendar:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async getRecommendedVaccinations(babyId) {
    try {
      const response = await api.get(
        `/babies/${babyId}/vaccinations/recommended`
      );
      return {
        success: true,
        recommended: response.data.data || response.data.recommended || [],
      };
    } catch (error) {
      console.error("❌ Erreur getRecommendedVaccinations:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async addStandardVaccination(babyId, vaccinationData) {
    try {
      const response = await api.post(
        `/babies/${babyId}/vaccinations/from-standard`,
        vaccinationData
      );
      return {
        success: true,
        vaccination: response.data.data || response.data.vaccination,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur addStandardVaccination:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur lors de l'ajout",
      };
    }
  },

  async addCustomVaccination(babyId, vaccinationData) {
    try {
      const response = await api.post(
        `/babies/${babyId}/vaccinations`,
        vaccinationData
      );
      return {
        success: true,
        vaccination: response.data.data || response.data.vaccination,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur addCustomVaccination:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message || "Erreur lors de l'ajout",
      };
    }
  },

  async getVaccinations(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/vaccinations`);
      return {
        success: true,
        vaccinations: response.data.data || response.data.vaccinations || [],
      };
    } catch (error) {
      console.error("❌ Erreur getVaccinations:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async updateVaccination(babyId, vaccinationId, data) {
    try {
      const response = await api.put(
        `/babies/${babyId}/vaccinations/${vaccinationId}`,
        data
      );
      return {
        success: true,
        vaccination: response.data.data || response.data.vaccination,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur updateVaccination:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de mise à jour",
      };
    }
  },

  async deleteVaccination(babyId, vaccinationId) {
    try {
      await api.delete(`/babies/${babyId}/vaccinations/${vaccinationId}`);
      return {
        success: true,
        message: "Vaccination supprimée avec succès",
      };
    } catch (error) {
      console.error("❌ Erreur deleteVaccination:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de suppression",
      };
    }
  },

  // ============= VACCINATION STATUS UPDATE =============
  async updateVaccinationStatus(babyId, vaccinationId, statusData) {
    try {
      console.log("🔄 Mise à jour statut vaccination:", {
        babyId,
        vaccinationId,
        statusData,
      });

      const response = await api.patch(
        `/babies/${babyId}/vaccinations/${vaccinationId}/status`,
        statusData
      );

      return {
        success: true,
        vaccination: response.data.data || response.data.vaccination,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur updateVaccinationStatus:", error);
      return {
        success: false,
        errors: error.response?.data?.errors,
        message:
          error.response?.data?.message || "Erreur lors de la mise à jour",
      };
    }
  },

  // ============= MEDICAL RECORDS =============
  async addMedicalRecord(babyId, recordData) {
    try {
      const response = await api.post(
        `/babies/${babyId}/medical-records`,
        recordData
      );
      return {
        success: true,
        record: response.data.data || response.data.record,
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

  async getMedicalRecords(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/medical-records`);
      return {
        success: true,
        records: response.data.data || response.data.records || [],
      };
    } catch (error) {
      console.error("❌ Erreur getMedicalRecords:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async updateMedicalRecord(babyId, recordId, data) {
    try {
      const response = await api.put(
        `/babies/${babyId}/medical-records/${recordId}`,
        data
      );
      return {
        success: true,
        record: response.data.data || response.data.record,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur updateMedicalRecord:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de mise à jour",
      };
    }
  },

  async deleteMedicalRecord(babyId, recordId) {
    try {
      await api.delete(`/babies/${babyId}/medical-records/${recordId}`);
      return {
        success: true,
        message: "Dossier supprimé avec succès",
      };
    } catch (error) {
      console.error("❌ Erreur deleteMedicalRecord:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de suppression",
      };
    }
  },

  // ============= MEAL PLANS =============
  async addMealPlan(babyId, mealData) {
    try {
      const response = await api.post(`/babies/${babyId}/meal-plans`, mealData);
      return {
        success: true,
        meal: response.data.data || response.data.meal,
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

  async getMealPlans(babyId) {
    try {
      const response = await api.get(`/babies/${babyId}/meal-plans`);
      return {
        success: true,
        meals: response.data.data || response.data.meals || [],
      };
    } catch (error) {
      console.error("❌ Erreur getMealPlans:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async getMealPlansForDay(babyId, date) {
    try {
      const response = await api.get(
        `/babies/${babyId}/meal-plans/day/${date}`
      );
      return {
        success: true,
        meals: response.data.data || response.data.meals || {},
      };
    } catch (error) {
      console.error("❌ Erreur getMealPlansForDay:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de chargement",
      };
    }
  },

  async updateMealPlan(babyId, mealId, data) {
    try {
      const response = await api.put(
        `/babies/${babyId}/meal-plans/${mealId}`,
        data
      );
      return {
        success: true,
        meal: response.data.data || response.data.meal,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Erreur updateMealPlan:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de mise à jour",
      };
    }
  },

  async deleteMealPlan(babyId, mealId) {
    try {
      await api.delete(`/babies/${babyId}/meal-plans/${mealId}`);
      return {
        success: true,
        message: "Repas supprimé avec succès",
      };
    } catch (error) {
      console.error("❌ Erreur deleteMealPlan:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de suppression",
      };
    }
  },
};
