// baby-growth-app/src/components/VaccinationCalendarItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const VaccinationCalendarItem = ({
  item,
  onStatusPress,
  getStatusColor,
  getStatusLabel,
}) => {
  return (
    <View style={styles.calendarItem}>
      <View style={styles.calendarItemLeft}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <View style={styles.calendarItemInfo}>
          <Text style={styles.vaccineName}>{item.vaccine_name}</Text>
          <Text style={styles.vaccineDetails}>
            Dose {item.dose_number}/{item.total_doses}
          </Text>
          <Text style={styles.vaccineDate}>
            📅 Prévue:{" "}
            {item.recommended_date &&
              new Date(item.recommended_date).toLocaleDateString("fr-FR")}
          </Text>
          {item.vaccination_date && (
            <Text style={styles.vaccineDate}>
              ✅ Administrée:{" "}
              {new Date(item.vaccination_date).toLocaleDateString("fr-FR")}
            </Text>
          )}
          {item.is_mandatory && (
            <Text style={styles.mandatory}>⚖️ Obligatoire</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.statusBadge}
        onPress={() => onStatusPress(item)}
      >
        <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  calendarItemLeft: { flexDirection: "row", flex: 1 },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  calendarItemInfo: { flex: 1 },
  vaccineName: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  vaccineDetails: { fontSize: 12, color: "#7f8c8d", marginTop: 3 },
  vaccineDate: { fontSize: 11, color: "#3498db", marginTop: 2 },
  mandatory: {
    fontSize: 11,
    color: "#e74c3c",
    marginTop: 2,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: "600", color: "#7f8c8d" },
});

export default VaccinationCalendarItem;
