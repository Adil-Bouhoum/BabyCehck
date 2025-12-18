// baby-growth-app/src/components/VaccinationStatusModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const VaccinationStatusModal = ({
  visible,
  vaccination,
  statusForm,
  updating,
  showDatePicker,
  datePickerType,
  onStatusChange,
  onNotesChange,
  onDatePress,
  onDateChange,
  onConfirm,
  onCancel,
}) => {
  const getStatusLabel = (status) => {
    const statusMap = {
      completed: "✅ Effectué",
      overdue: "⚠️ En retard",
      scheduled: "📅 Programmé",
      cancelled: "❌ Annulé",
    };
    return statusMap[status] || status;
  };

  if (!vaccination) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mettre à jour le statut</Text>
              <TouchableOpacity onPress={onCancel}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Vaccine Summary */}
              <View style={styles.vaccineSummary}>
                <Text style={styles.summaryLabel}>Vaccin:</Text>
                <Text style={styles.summaryValue}>
                  {vaccination.vaccine_name}
                </Text>
                {vaccination.dose_number && (
                  <Text style={styles.summarySubtitle}>
                    Dose {vaccination.dose_number}/{vaccination.total_doses}
                  </Text>
                )}
                {!vaccination.id && (
                  <View style={styles.newVaccinationBadge}>
                    <Text style={styles.newVaccinationText}>
                      ✨ Nouvelle vaccination
                    </Text>
                  </View>
                )}
              </View>

              {/* Status Selection */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Statut *</Text>
                <View style={styles.statusButtonsGroup}>
                  {[
                    { value: "scheduled", label: "📅 Programmé" },
                    { value: "completed", label: "✅ Effectué" },
                    { value: "cancelled", label: "❌ Annulé" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.statusModalButton,
                        statusForm.status === option.value &&
                          styles.statusModalButtonActive,
                      ]}
                      onPress={() => onStatusChange(option.value)}
                    >
                      <Text
                        style={[
                          styles.statusModalButtonText,
                          statusForm.status === option.value &&
                            styles.statusModalButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Vaccination Date (if completed) */}
              {statusForm.status === "completed" && (
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>Date de vaccination *</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => onDatePress("vaccination_date")}
                  >
                    <Text style={styles.dateButtonText}>
                      📅 {statusForm.vaccination_date}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Due Date (if scheduled) */}
              {statusForm.status === "scheduled" && (
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>Date programmée *</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => onDatePress("due_date")}
                  >
                    <Text style={styles.dateButtonText}>
                      📅 {statusForm.due_date}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Notes */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Notes (optionnel)</Text>
                <TextInput
                  style={[styles.modalInput, styles.notesInput]}
                  placeholder="Ajouter une note..."
                  value={statusForm.notes}
                  onChangeText={onNotesChange}
                  multiline
                  numberOfLines={3}
                  editable={!updating}
                  maxLength={300}
                />
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={onCancel}
                disabled={updating}
              >
                <Text style={styles.modalCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  updating && styles.buttonDisabled,
                ]}
                onPress={onConfirm}
                disabled={updating}
              >
                <Text style={styles.modalConfirmButtonText}>
                  {updating ? "Mise à jour..." : "Confirmer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Time Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={
            new Date(statusForm[datePickerType] || new Date().toISOString())
          }
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  modalClose: { fontSize: 24, color: "#95a5a6" },
  modalScrollContent: { padding: 20 },
  vaccineSummary: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryLabel: { fontSize: 12, color: "#7f8c8d", marginBottom: 5 },
  summaryValue: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  summarySubtitle: {
    fontSize: 13,
    color: "#3498db",
    marginTop: 5,
    fontWeight: "500",
  },
  newVaccinationBadge: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ecf9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
    borderRadius: 6,
  },
  newVaccinationText: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "600",
  },
  modalInputGroup: { marginBottom: 20 },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  statusButtonsGroup: { flexDirection: "column", gap: 10 },
  statusModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fcfcfc",
  },
  statusModalButtonActive: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
  },
  statusModalButtonText: { fontSize: 14, color: "#7f8c8d", fontWeight: "500" },
  statusModalButtonTextActive: { color: "white", fontWeight: "600" },
  dateButton: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fcfcfc",
    alignItems: "center",
  },
  dateButtonText: { fontSize: 15, color: "#333", fontWeight: "500" },
  modalInput: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    backgroundColor: "#fcfcfc",
    color: "#333",
  },
  notesInput: { minHeight: 80, textAlignVertical: "top" },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: "#e74c3c",
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancelButtonText: { color: "#e74c3c", fontSize: 14, fontWeight: "600" },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#2ecc71",
    borderRadius: 10,
    alignItems: "center",
  },
  modalConfirmButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
  buttonDisabled: { backgroundColor: "#bdc3c7" },
});

export default VaccinationStatusModal;
