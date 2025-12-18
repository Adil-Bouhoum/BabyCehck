// baby-growth-app/src/hooks/useVaccinationLogic.js
import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { babyService } from "../services/babyService";

/**
 * Custom hook for vaccination logic
 * Handles status updates, loading, and data management
 */
export const useVaccinationLogic = (babyId, onDataUpdated) => {
  const [calendar, setCalendar] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /**
   * Load vaccination data from backend
   */
  const loadVaccinationData = useCallback(async () => {
    setLoading(true);
    try {
      const calendarResult = await babyService.getVaccinationCalendar(babyId);
      const recommendedResult = await babyService.getRecommendedVaccinations(
        babyId
      );

      console.log("📊 Calendar data loaded:", calendarResult);
      console.log("📊 Recommended data loaded:", recommendedResult);

      if (calendarResult.success) {
        const calendarData =
          calendarResult.calendar || calendarResult.data || [];
        setCalendar(calendarData);
      }
      if (recommendedResult.success) {
        const recommendedData =
          recommendedResult.recommended || recommendedResult.data || [];
        setRecommended(recommendedData);
      }

      if (onDataUpdated) {
        onDataUpdated();
      }
    } catch (error) {
      console.error("Erreur chargement vaccinations:", error);
      Alert.alert("Erreur", "Impossible de charger les vaccinations");
    } finally {
      setLoading(false);
    }
  }, [babyId, onDataUpdated]);

  /**
   * Update vaccination status (creates new record if needed)
   */
  const updateVaccinationStatus = useCallback(
    async (vaccination, statusData) => {
      setUpdating(true);
      try {
        let result;

        // Check if this is a new vaccination that needs to be created first
        if (!vaccination.id && vaccination.standard_vaccine_id) {
          console.log("✨ Création d'une nouvelle vaccination standard...");
          const createResult = await babyService.addStandardVaccination(
            babyId,
            {
              standard_vaccine_id: vaccination.standard_vaccine_id,
              vaccination_date: statusData.vaccination_date,
              dose_number: vaccination.dose_number,
              notes: statusData.notes,
            }
          );

          if (!createResult.success) {
            Alert.alert("Erreur", "Impossible de créer la vaccination");
            setUpdating(false);
            return { success: false };
          }

          // Now update the status if it's not completed
          if (statusData.status !== "completed") {
            const newVaccinationId = createResult.vaccination?.id;
            result = await babyService.updateVaccinationStatus(
              babyId,
              newVaccinationId,
              statusData
            );
          } else {
            result = createResult;
          }
        } else {
          // Update existing vaccination
          result = await babyService.updateVaccinationStatus(
            babyId,
            vaccination.id,
            statusData
          );
        }

        if (result.success) {
          Alert.alert("Succès", "Vaccination enregistrée et mise à jour");
          // Reload data
          await new Promise((resolve) => setTimeout(resolve, 500));
          await loadVaccinationData();
          return { success: true };
        } else {
          Alert.alert(
            "Erreur",
            result.message || "Impossible de mettre à jour le statut"
          );
          return { success: false };
        }
      } catch (error) {
        console.error("Erreur mise à jour statut:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
        return { success: false };
      } finally {
        setUpdating(false);
      }
    },
    [babyId, loadVaccinationData]
  );

  /**
   * Delete a vaccination
   */
  const deleteVaccination = useCallback(
    async (vaccinationId) => {
      try {
        const result = await babyService.deleteVaccination(
          babyId,
          vaccinationId
        );
        if (result.success) {
          Alert.alert("Succès", "Vaccination supprimée");
          loadVaccinationData();
        } else {
          Alert.alert("Erreur", "Impossible de supprimer");
        }
      } catch (error) {
        console.error("Erreur suppression:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      }
    },
    [babyId, loadVaccinationData]
  );

  return {
    calendar,
    recommended,
    loading,
    updating,
    loadVaccinationData,
    updateVaccinationStatus,
    deleteVaccination,
  };
};
