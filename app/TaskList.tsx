import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";

export default function TaskList() {
  const { tasks, toggleDone, removeTask } = useTaskStore();
  const router = useRouter();

  const onDelete = (id: number) => {
    Alert.alert("Confirmar", "¿Eliminar tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => removeTask(id),
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Pressable style={{ flex: 1 }} onPress={() => toggleDone(item.id)}>
        <Text
          style={[
            styles.title,
            item.done && { textDecorationLine: "line-through", opacity: 0.5 },
          ]}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            styles.desc,
            item.done && { textDecorationLine: "line-through", opacity: 0.5 },
          ]}
        >
          {item.description}
        </Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push(`/task/${item.id}`)}
        >
          <Text style={styles.actionTxt}>Ver</Text>
        </Pressable>

        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push(`/task/edit/${item.id}`)}
        >
          <Text style={styles.actionTxt}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#e05a4f" }]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionTxt}>Borrar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(t) => String(t.id)}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No hay tareas
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
  },
  title: { fontWeight: "700", fontSize: 16 },
  desc: { color: "#666", marginTop: 4 },
  actions: { marginLeft: 12, alignItems: "flex-end" },
  actionBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  actionTxt: { color: "#fff", fontWeight: "700" },
});
