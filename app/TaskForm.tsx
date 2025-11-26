import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";
import { TaskCreateInput, taskCreateSchema } from "../lib/shemas/TaskSchemas";

export default function TaskForm() {
  const { addTask } = useTaskStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof TaskCreateInput, string>>>({});

  const save = async () => {
    try {
      setErrors({});

      const parsed = taskCreateSchema.parse({
        title: title.trim(),
        description: description.trim(),
      });

      await addTask({
        title: parsed.title,
        description: parsed.description,
      });

      router.back();
    } catch (e: any) {
      if (e?.issues) {
        const formErrors: Partial<Record<keyof TaskCreateInput, string>> = {};
        e.issues.forEach((issue: any) => {
          const field = issue.path[0] as keyof TaskCreateInput;
          formErrors[field] = issue.message;
        });
        setErrors(formErrors);
        Alert.alert("❌ Error de validación", "Por favor corrige los errores.");
        return;
      }

      console.error("Error saving task:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        value={title}
        onChangeText={setTitle}
        placeholder="Mi tarea"
      />
      {errors.title && <Text style={styles.err}>{errors.title}</Text>}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea, errors.description && styles.inputError]}
        value={description}
        onChangeText={setDescription}
        placeholder="Detalle de la tarea"
        multiline
      />
      {errors.description && <Text style={styles.err}>{errors.description}</Text>}

      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnTxt}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  label: { marginTop: 10, fontSize: 16, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: { borderColor: "#e05a4f", borderWidth: 2 },
  textArea: { height: 100, textAlignVertical: "top" },
  btn: {
    marginTop: 24,
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  err: { color: "#e05a4f", marginTop: 4, fontSize: 14 },
});
