// app/task/[id].tsx - REFACTORIZADO (LÓGICA INTACTA)
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Alert, 
  StyleSheet, 
  Text, 
  View,
  ActivityIndicator 
} from "react-native";
import { useTaskStore } from "../../lib/context/TaskContext";
import { TaskDTO } from "../../services/api";
import {
  CheckCircle,
  RotateCcw,
  Pencil,
  ArrowLeft,
  Calendar
} from "lucide-react-native";
import { Button, Badge, ErrorScreen } from "../../components/ui";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, editTask } = useTaskStore();
  const [loading, setLoading] = useState(false);

  // Buscar la tarea por ID (con tipado correcto)
  const task = tasks.find((t: TaskDTO) => String(t.id) === String(id));

  // Si no existe la tarea
  if (!task) {
    return (
      <ErrorScreen
        message="Tarea no encontrada."
        onRetry={() => router.back()}
      />
    );
  }

  // ✅ Marcar tarea como completada
  const markAsDone = () => {
    Alert.alert(
      "¿Marcar como hecha?",
      "La tarea seguirá visible, pero marcada como completada.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, marcar como hecha",
          onPress: async () => {
            setLoading(true);
            try {
              await editTask(task.id, { done: true });
              
              Alert.alert("Éxito", "Tarea marcada como completada", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert(
                "Error", 
                "No se pudo marcar la tarea como hecha. Revisa tu conexión.",
                [{ text: "OK" }]
              );
              console.error("Error al marcar como hecha:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // ✅ Desmarcar tarea (volver a pendiente)
  const markAsPending = () => {
    Alert.alert(
      "¿Marcar como pendiente?",
      "La tarea volverá a estar sin completar.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, marcar como pendiente",
          onPress: async () => {
            setLoading(true);
            try {
              await editTask(task.id, { done: false });
              
              Alert.alert("Éxito", "Tarea marcada como pendiente");
            } catch (error) {
              Alert.alert(
                "Error", 
                "No se pudo cambiar el estado de la tarea.",
                [{ text: "OK" }]
              );
              console.error("Error al marcar como pendiente:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Título con estado */}
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        {task.done && (
          <Badge variant="success" icon={CheckCircle}>
            Completada
          </Badge>
        )}
      </View>

      {/* Descripción */}
      <Text style={styles.desc}>{task.description}</Text>

      {/* Fecha de creación */}
      <View style={styles.dateRow}>
        <Calendar size={16} color="#6b7280" style={styles.iconInline} />
        <Text style={styles.date}>
          Creada: {new Date(task.createdAt).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actions}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <>
            {/* Botón de completar/descompletar */}
            {!task.done ? (
              <Button
                onPress={markAsDone}
                variant="success"
                icon={CheckCircle}
              >
                Marcar como hecha
              </Button>
            ) : (
              <Button
                onPress={markAsPending}
                variant="warning"
                icon={RotateCcw}
              >
                Marcar como pendiente
              </Button>
            )}

            {/* 🔧 NAVEGACIÓN CORREGIDA - Apunta a TaskEdit con el ID */}
            <Button
              onPress={() => router.push({
                pathname: "/TaskEdit",
                params: { id: task.id }
              })}
              variant="primary"
              icon={Pencil}
            >
              Editar
            </Button>

            {/* Botón volver */}
            <Button
              onPress={() => router.back()}
              variant="secondary"
              icon={ArrowLeft}
            >
              Volver
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800",
    color: "#111",
    flex: 1
  },
  desc: { 
    marginTop: 10, 
    color: "#444", 
    fontSize: 16,
    lineHeight: 24
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 6
  },
  date: {
    color: "#6b7280",
    fontSize: 14,
    fontStyle: "italic"
  },
  iconInline: {
    marginRight: 2
  },
  actions: {
    marginTop: 32
  },
});