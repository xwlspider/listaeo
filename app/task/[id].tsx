import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTaskStore } from "../../lib/context/TaskContext";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, updateTask } = useTaskStore();

  const task = tasks.find((t: { id: any; }) => String(t.id) === String(id));

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Tarea no encontrada.</Text>
      </View>
    );
  }

  const markAsDone = () => {
    Alert.alert(
      "¿Marcar como hecha?",
      "La tarea seguirá visible, pero marcada como completada.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            await updateTask(task.id, { done: true });
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {task.title} {task.done ? "(Hecha)" : ""}
      </Text>

      <Text style={styles.desc}>{task.description}</Text>

      <View style={{ marginTop: 20 }}>
        {!task.done && (
          <Pressable
            style={[styles.btn, { backgroundColor: "green" }]}
            onPress={markAsDone}
          >
            <Text style={styles.btnTxt}>✔ Marcar como hecha</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.btn, { backgroundColor: "#3b82f6" }]}
          onPress={() => router.push(`/task/edit/${task.id}`)}
        >
          <Text style={styles.btnTxt}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#999" }]}
          onPress={() => router.back()}
        >
          <Text style={styles.btnTxt}>Volver</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "800" },
  desc: { marginTop: 10, color: "#444", fontSize: 16 },
  btn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
