// app/TaskList.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";
import { TaskDTO } from "../services/api";

export default function TaskList() {
  const { tasks, toggleDone, removeTask, loadTasks } = useTaskStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTasks();
    } catch (error) {
      console.error("Error al recargar tareas:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 🗑️ Eliminar tarea con confirmación
  const onDelete = (id: number, title: string) => {
    Alert.alert(
      "🗑️ ¿Eliminar tarea?",
      `¿Estás seguro de eliminar "${title}"? Esta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTask(id);
              Alert.alert("✅ Eliminada", "La tarea fue eliminada correctamente");
            } catch (error) {
              Alert.alert(
                "❌ Error",
                "No se pudo eliminar la tarea. Intenta de nuevo.",
                [{ text: "OK" }]
              );
              console.error("Error al eliminar:", error);
            }
          },
        },
      ]
    );
  };

  // ✅ Toggle done con feedback
  const handleToggleDone = async (id: number, currentDone: boolean) => {
    try {
      await toggleDone(id);
      // Opcional: mostrar toast o feedback visual
    } catch (error) {
      Alert.alert(
        "❌ Error",
        "No se pudo cambiar el estado de la tarea.",
        [{ text: "OK" }]
      );
      console.error("Error al cambiar estado:", error);
    }
  };

  // 📝 Renderizar cada tarea
  const renderItem = ({ item }: { item: TaskDTO }) => (
    <View style={styles.item}>
      {/* Contenido de la tarea (clickeable para toggle) */}
      <Pressable
        style={styles.content}
        onPress={() => handleToggleDone(item.id, item.done)}
      >
        {/* Indicador de estado */}
        <View
          style={[
            styles.statusIndicator,
            item.done ? styles.indicatorDone : styles.indicatorPending,
          ]}
        />

        <View style={styles.textContainer}>
          {/* Título */}
          <Text
            style={[
              styles.title,
              item.done && styles.textCompleted,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Descripción */}
          {item.description ? (
            <Text
              numberOfLines={2}
              style={[
                styles.desc,
                item.done && styles.textCompleted,
              ]}
            >
              {item.description}
            </Text>
          ) : null}

          {/* Fecha */}
          <Text style={styles.date}>
            📅 {new Date(item.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      </Pressable>

      {/* Botones de acción */}
      <View style={styles.actions}>
        {/* Ver detalle */}
        <Pressable
          style={[styles.actionBtn, styles.btnInfo]}
          onPress={() => router.push(`/task/${item.id}`)}
        >
          <Text style={styles.actionTxt}>👁️ Ver</Text>
        </Pressable>

        {/* Editar - NAVEGACIÓN CORREGIDA */}
        <Pressable
          style={[styles.actionBtn, styles.btnPrimary]}
          onPress={() => router.push({
            pathname: "/TaskEdit",
            params: { id: item.id }
          })}
        >
          <Text style={styles.actionTxt}>✏️ Editar</Text>
        </Pressable>

        {/* Eliminar */}
        <Pressable
          style={[styles.actionBtn, styles.btnDanger]}
          onPress={() => onDelete(item.id, item.title)}
        >
          <Text style={styles.actionTxt}>🗑️ Borrar</Text>
        </Pressable>
      </View>
    </View>
  );

  // 📋 Componente vacío
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>No hay tareas</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera tarea para empezar
      </Text>
      <Pressable
        style={styles.emptyBtn}
        onPress={() => router.push("/TaskForm")}
      >
        <Text style={styles.emptyBtnTxt}>+ Nueva Tarea</Text>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(t) => String(t.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<EmptyList />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3b82f6"]}
          tintColor="#3b82f6"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  item: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  indicatorDone: {
    backgroundColor: "#10b981",
  },
  indicatorPending: {
    backgroundColor: "#f59e0b",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
    marginBottom: 4,
  },
  desc: {
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  textCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  actions: {
    marginLeft: 12,
    gap: 6,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  btnInfo: {
    backgroundColor: "#6b7280",
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
  },
  btnDanger: {
    backgroundColor: "#ef4444",
  },
  actionTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});