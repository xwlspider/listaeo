
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View,RefreshControl, Alert, } from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";
import { TaskDTO } from "../services/api";
import {
  CheckCircle,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  ClipboardList,
  Plus,
} from "lucide-react-native";
import {  Button, Card, StatusDot, EmptyState, LoadingScreen,} from "../components/ui";

export default function Index() {
  const router = useRouter();
  const { tasks, loadTasks, toggleDone, removeTask } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar tareas al montar
  useEffect(() => {
    loadInitialTasks();
  }, []);

  const loadInitialTasks = async () => {
    try {
      await loadTasks();
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      Alert.alert("Error", "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTasks();
    } catch (error) {
      console.error("Error al refrescar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Toggle done con manejo de errores
  const handleToggleDone = async (id: number) => {
    try {
      await toggleDone(id);
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar el estado de la tarea");
      console.error("Error toggle:", error);
    }
  };

  // 🗑️ Eliminar con confirmación
  const handleRemove = (id: number, title: string) => {
    Alert.alert(
      "¿Eliminar tarea?",
      `¿Estás seguro de eliminar "${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTask(id);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarea");
              console.error("Error delete:", error);
            }
          },
        },
      ]
    );
  };

  // 📝 Renderizar cada tarea
  const renderTask = ({ item }: { item: TaskDTO }) => (
    <Card variant={item.done ? "success" : "default"}>
      {/* Contenido principal */}
      <View style={styles.taskContent}>
        {/* Indicador de estado */}
        <StatusDot variant={item.done ? "success" : "warning"} />

        <View style={styles.taskText}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, item.done && styles.titleDone]}>
              {item.title}
            </Text>
            {item.done && (
              <CheckCircle size={18} color="#10b981" style={styles.checkIcon} />
            )}
          </View>
          
          {item.description ? (
            <Text style={[styles.desc, item.done && styles.descDone]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.dateRow}>
            <Calendar size={12} color="#9ca3af" style={styles.iconInline} />
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actions}>
        {/* Toggle Done */}
        <Button
          onPress={() => handleToggleDone(item.id)}
          variant={item.done ? "warning" : "success"}
          icon={item.done ? RotateCcw : CheckCircle}
          iconSize={14}
          style={styles.actionBtn}
        >
          {item.done ? "Desmarcar" : "Hecha"}
        </Button>

        {/* Ver detalle */}
        <Button
          onPress={() => router.push(`/task/${item.id}`)}
          variant="info"
          icon={Eye}
          iconSize={14}
          style={styles.actionBtn}
        >
          Ver
        </Button>

        {/* Editar */}
        <Button
          onPress={() =>
            router.push({
              pathname: "/TaskEdit",
              params: { id: item.id },
            })
          }
          variant="primary"
          icon={Pencil}
          iconSize={14}
          style={styles.actionBtn}
        >
          Editar
        </Button>

        {/* Eliminar */}
        <Button
          onPress={() => handleRemove(item.id, item.title)}
          variant="danger"
          icon={Trash2}
          iconSize={14}
          style={[styles.actionBtn, styles.deleteBtn]}
        >
          {""}
        </Button>
      </View>
    </Card>
  );

  // ⏳ Loading inicial
  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Mis Tareas" }} />
        <LoadingScreen message="Cargando tareas..." />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Mis Tareas",
          headerLeft: () => (
            <ClipboardList size={20} color="#000" style={{ marginRight: 8 }} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/TaskForm")}
              style={styles.headerBtn}
            >
              <Plus size={16} color="#fff" style={styles.iconBtn} />
              <Text style={styles.headerBtnTxt}>Nueva</Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={ClipboardList}
            title="No hay tareas"
            subtitle="¡Crea tu primera tarea para comenzar!"
            buttonText="Nueva Tarea"
            onButtonPress={() => router.push("/TaskForm")}
            buttonIcon={Plus}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskText: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  titleDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  checkIcon: {
    marginLeft: 4,
  },
  desc: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  descDone: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  iconInline: {
    marginRight: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  actionBtn: {
    flex: 1,
    minWidth: 70,
    marginTop: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  deleteBtn: {
    flex: 0,
    minWidth: 45,
  },
  headerBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  iconBtn: {
    marginRight: 2,
  },
});