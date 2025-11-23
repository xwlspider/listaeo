// app/TaskForm.tsx
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
  
      // 👇 Primero validar (ZOD)
      const parsed = taskCreateSchema.parse({ title, description });
  
      // 👇 Luego guardar la tarea
      await addTask({
        title: parsed.title,
        description: parsed.description,
      });
  
      router.push("/");
    } catch (e: any) {
      // 🔍 Si es error de Zod → issues
      if (e?.issues) {
        const zodErrors: any = {};
  
        e.issues.forEach((iss: any) => {
          zodErrors[iss.path[0]] = iss.message;
        });
  
        setErrors(zodErrors);
        return; // 👈 MEGA IMPORTANTE para evitar que también salga la alerta
      }
  
      // ⚠ Error real del servidor
      Alert.alert("Error", "No se pudo crear la tarea.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Mi tarea" />
      {errors.title ? <Text style={styles.err}>{errors.title}</Text> : null}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Detalle de la tarea"
        multiline
      />
      {errors.description ? <Text style={styles.err}>{errors.description}</Text> : null}

      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnTxt}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  label: { marginTop: 10, fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  btn: { marginTop: 16, backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, alignItems: "center" },
  btnTxt: { color: "#fff", fontWeight: "700" },
  err: { color: "#e05a4f", marginTop: 6 },
});

