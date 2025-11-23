
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTaskStore } from "../../lib/context/TaskContext";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks } = useTaskStore();

  const task = tasks.find((t) => String(t.id) === String(id));

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Tarea no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.desc}>{task.description}</Text>

      <View style={{ marginTop: 20 }}>
        <Pressable style={styles.btn} onPress={() => router.push(`/task/edit/${task.id}`)}>
          <Text style={styles.btnTxt}>Editar</Text>
        </Pressable>

        <Pressable style={[styles.btn, { backgroundColor: "#999" }]} onPress={() => router.back()}>
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
  desc: { marginTop: 10, color: "#444" },
  btn: { marginTop: 12, backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, alignItems: "center" },
  btnTxt: { color: "#fff", fontWeight: "700" },
});
