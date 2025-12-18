// baby-growth-app/src/utils/vaccinationUtils.js

/**
 * Get color for status
 */
export const getStatusColor = (status) => {
  const colorMap = {
    completed: "#2ecc71",
    overdue: "#e74c3c",
    scheduled: "#f39c12",
    cancelled: "#95a5a6",
  };
  return colorMap[status] || "#95a5a6";
};

/**
 * Get label for status
 */
export const getStatusLabel = (status) => {
  const statusMap = {
    completed: "✅ Effectué",
    overdue: "⚠️ En retard",
    scheduled: "📅 Programmé",
    cancelled: "❌ Annulé",
  };
  return statusMap[status] || status;
};

/**
 * Format vaccination status form data for API
 */
export const formatStatusUpdateData = (statusForm) => {
  const updateData = {
    status: statusForm.status,
  };

  // Add dates according to status
  if (statusForm.status === "completed") {
    updateData.vaccination_date = statusForm.vaccination_date;
  } else if (statusForm.status === "scheduled") {
    updateData.due_date = statusForm.due_date;
  }

  // Add notes if provided
  if (statusForm.notes.trim()) {
    updateData.notes = statusForm.notes;
  }

  return updateData;
};

/**
 * Validate status form
 */
export const validateStatusForm = (statusForm) => {
  if (!statusForm.status) {
    return { valid: false, error: "Veuillez sélectionner un statut" };
  }

  if (statusForm.status === "completed" && !statusForm.vaccination_date) {
    return {
      valid: false,
      error: "La date de vaccination est requise pour un vaccin effectué",
    };
  }

  if (statusForm.status === "scheduled" && !statusForm.due_date) {
    return {
      valid: false,
      error: "La date programmée est requise pour un vaccin planifié",
    };
  }

  return { valid: true };
};

/**
 * Initialize status form with vaccination data
 */
export const initializeStatusForm = (vaccination) => {
  return {
    status: vaccination.status || "completed",
    vaccination_date: vaccination.vaccination_date
      ? vaccination.vaccination_date
      : new Date().toISOString().split("T")[0],
    due_date: vaccination.due_date
      ? vaccination.due_date
      : new Date().toISOString().split("T")[0],
    notes: vaccination.notes || "",
  };
};

/**
 * Reset status form to initial state
 */
export const resetStatusForm = () => {
  return {
    status: "completed",
    vaccination_date: new Date().toISOString().split("T")[0],
    due_date: new Date().toISOString().split("T")[0],
    notes: "",
  };
};
