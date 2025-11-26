import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

// RUTA CORRECTA DEL STORE
import { useTaskStore } from "../lib/context/TaskContext";

export default function EditTask() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, editTask } = useTaskStore();

  const task = tasks.find((t: any) => String(t.id) === String(id));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título no puede estar vacío.");
      return;
    }

    await editTask(Number(id), {
      title,
      description,
    });

    Alert.alert("Guardado", "La tarea se actualizó correctamente.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Tarea no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Editar Tarea" }} />

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el título..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        placeholder="Escribe la descripción..."
        value={description}
        multiline
        onChangeText={setDescription}
      />

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveTxt}>Guardar Cambios</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backTxt}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },

  saveTxt: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  backBtn: {
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: "#aaa",
  },

  backTxt: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
