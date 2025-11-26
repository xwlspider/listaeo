import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";

export default function Index() {
  const router = useRouter();
  const { tasks, loadTasks, toggleDone, removeTask } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Mis Tareas" }} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, item.done && styles.done]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {item.title} {item.done ? "✔" : ""}
              </Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>

            {/* Contenedor de botones */}
            <View style={styles.actions}>

              {/* Botón: Hecha / Desmarcar */}
              <Pressable
                onPress={() => toggleDone(item.id)}
                style={[
                  styles.btn,
                  { backgroundColor: item.done ? "#f87171" : "#16a34a" }
                ]}
              >
                <Text style={styles.btnTxt}>
                  {item.done ? "Desmarcar" : "Hecha"}
                </Text>
              </Pressable>

              {/* Botón: Editar */}
              <Pressable
                onPress={() => router.push(`/TaskEdit?id=${item.id}`)}
                style={[styles.btn, { backgroundColor: "#3b82f6" }]}
              >
                <Text style={styles.btnTxt}>Editar</Text>
              </Pressable>

              {/* Botón: Eliminar */}
              <Pressable
                onPress={() => removeTask(item.id)}
                style={[styles.btn, { backgroundColor: "#ef4444" }]}
              >
                <Text style={styles.btnTxt}>Eliminar</Text>
              </Pressable>

            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },

  taskItem: {
    padding: 15,
    marginBottom: 14,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  done: {
    backgroundColor: "#d1fae5",
  },

  title: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#111827",
  },

  desc: { 
    color: "#374151", 
    marginTop: 5 
  },

  actions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  btnTxt: {
    color: "#fff",
    fontWeight: "700",
  },
});
