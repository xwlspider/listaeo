// app/TaskEdit.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useTaskStore } from "../lib/context/TaskContext";
import { TaskDTO } from "../services/api";
import { 
  Save, 
  Trash2, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Calendar,
  Pencil,
  X
} from "lucide-react-native";

export default function EditTask() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, editTask, removeTask } = useTaskStore();

  // 🔍 Buscar tarea con tipado correcto
  const task = tasks.find((t: TaskDTO) => String(t.id) === String(id));

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Cargar datos de la tarea al montar
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  // 💾 Guardar cambios
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("⚠️ Error", "El título no puede estar vacío.");
      return;
    }
  
    setLoading(true);
    try {
      // 👇 AGREGA ESTOS LOGS
      console.log("════════════════════════════");
      console.log("🔍 TASKEDIT - handleSave");
      console.log("ID original:", id);
      console.log("ID Number:", Number(id));
      console.log("════════════════════════════");
  
      await editTask(Number(id), {
        title: title.trim(),
        description: description.trim(),
      });
  
      Alert.alert("✅ Guardado", "La tarea se actualizó correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      Alert.alert(
        "❌ Error",
        "No se pudo actualizar la tarea.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar tarea
  const handleDelete = () => {
    Alert.alert(
      "¿Eliminar tarea?",
      "Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await removeTask(Number(id));

              Alert.alert("Eliminada", "La tarea fue eliminada.", [
                { text: "OK", onPress: () => router.replace("/") },
              ]);
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar la tarea.",
                [{ text: "OK" }]
              );
              console.error("Error al eliminar tarea:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // ❌ Si no existe la tarea
  if (!task) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Tarea no encontrada" }} />
        <View style={styles.errorContainer}>
          <X size={48} color="#ef4444" />
          <Text style={styles.errorText}>Tarea no encontrada</Text>
        </View>
        <Pressable
          style={[styles.backBtn, { marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#fff" style={styles.iconLeft} />
          <Text style={styles.backTxt}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ 
        title: "Editar Tarea",
        headerLeft: () => <Pencil size={20} color="#000" style={{ marginRight: 8 }} />
      }} />

      {/* Información del estado */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Estado:</Text>
        <View
          style={[
            styles.statusBadge,
            task.done ? styles.badgeDone : styles.badgePending,
          ]}
        >
          {task.done ? (
            <CheckCircle size={16} color="#fff" style={styles.iconInline} />
          ) : (
            <Clock size={16} color="#fff" style={styles.iconInline} />
          )}
          <Text style={styles.statusText}>
            {task.done ? "Completada" : "Pendiente"}
          </Text>
        </View>
      </View>

      {/* Campo: Título */}
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el título..."
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        editable={!loading}
      />

      {/* Campo: Descripción */}
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Escribe la descripción (opcional)..."
        placeholderTextColor="#9ca3af"
        value={description}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        onChangeText={setDescription}
        editable={!loading}
      />

      {/* Fecha de creación */}
      <View style={styles.dateContainer}>
        <Calendar size={16} color="#6b7280" style={styles.iconInline} />
        <Text style={styles.dateText}>
          Creada: {new Date(task.createdAt).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>

      {/* Botones de acción */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={{ marginTop: 30 }}
        />
      ) : (
        <>
          {/* Guardar */}
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Save size={20} color="#fff" style={styles.iconLeft} />
            <Text style={styles.saveTxt}>Guardar Cambios</Text>
          </Pressable>

          {/* Eliminar */}
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Trash2 size={20} color="#fff" style={styles.iconLeft} />
            <Text style={styles.deleteTxt}>Eliminar Tarea</Text>
          </Pressable>

          {/* Cancelar */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#fff" style={styles.iconLeft} />
            <Text style={styles.backTxt}>Cancelar</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 12,
  },
  statusCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeDone: {
    backgroundColor: "#10b981",
  },
  badgePending: {
    backgroundColor: "#f59e0b",
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#111",
    marginBottom: 10,
  },
  textarea: {
    minHeight: 120,
    paddingTop: 14,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  saveBtn: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveTxt: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteTxt: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  backBtn: {
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 40,
    backgroundColor: "#6b7280",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backTxt: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  iconLeft: {
    marginRight: 4,
  },
  iconInline: {
    marginRight: 4,
  },
});