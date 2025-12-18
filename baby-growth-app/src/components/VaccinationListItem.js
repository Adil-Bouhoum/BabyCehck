// baby-growth-app/src/components/VaccinationListItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const VaccinationListItem = ({
  item,
  onEditPress,
  onDeletePress,
  getStatusColor,
  getStatusLabel,
}) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <View style={styles.listItemTitle}>
          <Text style={styles.listItemName}>{item.vaccine_name}</Text>
          {item.dose_number && (
            <Text style={styles.listItemDose}>
              Dose {item.dose_number}
              {item.total_doses ? `/${item.total_doses}` : ""}
            </Text>
          )}
        </View>
        <View style={styles.listItemActions}>
          <TouchableOpacity
            onPress={() => onEditPress(item)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeletePress(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listItemDetails}>
        {item.vaccination_date && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(item.vaccination_date).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        )}
        {item.due_date && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Prochaine:</Text>
            <Text style={styles.detailValue}>
              {new Date(item.due_date).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        )}
        {item.status && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Statut:</Text>
            <Text
              style={[
                styles.detailValue,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        )}
        {item.lot_number && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lot:</Text>
            <Text style={styles.detailValue}>{item.lot_number}</Text>
          </View>
        )}
        {item.clinic && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lieu:</Text>
            <Text style={styles.detailValue}>{item.clinic}</Text>
          </View>
        )}
      </View>

      {item.notes && <Text style={styles.itemNotes}>📝 {item.notes}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  listItemTitle: { flex: 1 },
  listItemName: { fontSize: 15, fontWeight: "bold", color: "#2c3e50" },
  listItemDose: { fontSize: 12, color: "#3498db", marginTop: 3 },
  listItemActions: { flexDirection: "row", gap: 8 },
  editButton: { padding: 5 },
  editButtonText: { fontSize: 18 },
  deleteButton: { padding: 5 },
  deleteButtonText: { fontSize: 18 },
  listItemDetails: { marginBottom: 10 },
  detailRow: { flexDirection: "row", marginBottom: 6 },
  detailLabel: { fontSize: 12, color: "#7f8c8d", width: 70 },
  detailValue: { fontSize: 12, color: "#2c3e50", fontWeight: "500", flex: 1 },
  itemNotes: { fontSize: 12, color: "#7f8c8d", fontStyle: "italic" },
});

export default VaccinationListItem;
