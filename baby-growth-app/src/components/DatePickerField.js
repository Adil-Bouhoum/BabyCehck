// baby-growth-app/src/components/DatePickerField.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

/**
 * Reusable DatePickerField Component
 * Replaces TextInput for date fields with calendar picker
 */
const DatePickerField = ({
  label,
  value,
  onChange,
  placeholder = "Sélectionner une date...",
  hint = "Format: JJ/MM/AAAA",
  required = false,
  editable = true,
  minDate = null,
  maxDate = null,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  /**
   * Format date for display (YYYY-MM-DD -> DD/MM/YYYY)
   */
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return placeholder;
    try {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return placeholder;
    }
  };

  /**
   * Convert YYYY-MM-DD to Date object
   */
  const getDateObject = () => {
    if (!value) return new Date();
    try {
      return new Date(value + "T00:00:00");
    } catch {
      return new Date();
    }
  };

  /**
   * Handle date selection
   */
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      // Format to YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      onChange(formattedDate);
    }

    setShowPicker(false);
  };

  const isDisabled = !editable;

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.dateButton, isDisabled && styles.dateButtonDisabled]}
        onPress={() => !isDisabled && setShowPicker(true)}
        disabled={isDisabled}
      >
        <Text style={[styles.dateButtonIcon]}>📅</Text>
        <Text
          style={[
            styles.dateButtonText,
            !value && styles.dateButtonPlaceholder,
          ]}
        >
          {formatDateForDisplay(value)}
        </Text>
      </TouchableOpacity>

      {hint && <Text style={styles.hint}>{hint}</Text>}

      {showPicker && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.pickerHeaderButton}>✕ Fermer</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Sélectionner une date</Text>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={{ width: 70 }}
                >
                  <Text
                    style={[styles.pickerHeaderButton, { textAlign: "right" }]}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContent}>
                <DateTimePicker
                  value={getDateObject()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  textColor="#2c3e50"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  required: {
    color: "#e74c3c",
    fontSize: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fcfcfc",
    gap: 12,
  },
  dateButtonDisabled: {
    backgroundColor: "#f0f0f0",
    opacity: 0.6,
  },
  dateButtonIcon: {
    fontSize: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  dateButtonPlaceholder: {
    color: "#95a5a6",
    fontWeight: "400",
  },
  hint: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 5,
    marginLeft: 5,
  },
  pickerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  pickerHeaderButton: {
    fontSize: 14,
    color: "#3498db",
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  pickerContent: {
    paddingVertical: 20,
  },
});

export default DatePickerField;
