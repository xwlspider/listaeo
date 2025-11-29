// app/TaskForm.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";
import { TaskCreateInput, taskCreateSchema } from "../lib/shemas/TaskSchemas";
import {
  ClipboardList,
  Save,
  ArrowLeft,
  AlertCircle
} from "lucide-react-native";

export default function TaskForm() {
  const { addTask } = useTaskStore();
  const router = useRouter();

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof TaskCreateInput, string>>>({});
  const [loading, setLoading] = useState(false);

  // 💾 Guardar nueva tarea
  const save = async () => {
    try {
      // Limpiar errores previos
      setErrors({});
      setLoading(true);

      // ✅ Validar con Zod (ahora hace .trim() automáticamente)
      const parsed = taskCreateSchema.parse({
        title,
        description,
      });

      // 📤 POST a la API a través del Context
      await addTask({
        title: parsed.title,
        description: parsed.description,
      });

      // Éxito - Limpiar formulario y volver
      Alert.alert("Tarea creada", "Tu tarea fue guardada correctamente.", [
        { 
          text: "OK", 
          onPress: () => {
            setTitle("");
            setDescription("");
            router.back();
          }
        },
      ]);
    } catch (e: any) {
      // Error de validación Zod
      if (e?.issues) {
        const formErrors: Partial<Record<keyof TaskCreateInput, string>> = {};
        e.issues.forEach((issue: any) => {
          const field = issue.path[0] as keyof TaskCreateInput;
          formErrors[field] = issue.message;
        });
        setErrors(formErrors);
        Alert.alert("Errores en el formulario", "Por favor corrige los campos marcados.");
        return;
      }

      // Error de red/API
      console.error("Error al guardar tarea:", e);
      Alert.alert(
        "Error al guardar",
        "No se pudo crear la tarea. Revisa tu conexión.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Limpiar formulario
  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        "¿Descartar cambios?",
        "Los datos ingresados se perderán.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí, descartar",
            style: "destructive",
            onPress: () => {
              setTitle("");
              setDescription("");
              setErrors({});
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Título del formulario */}
        <View style={styles.header}>
          <ClipboardList size={32} color="#3b82f6" style={styles.headerIcon} />
          <View style={styles.headerText}>
            <Text style={styles.formTitle}>Nueva Tarea</Text>
            <Text style={styles.subtitle}>
              Completa los campos para crear una nueva tarea
            </Text>
          </View>
        </View>

        {/* Campo: Título */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Título <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              // Limpiar error al escribir
              if (errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            placeholder="Ej: Comprar leche"
            placeholderTextColor="#9ca3af"
            editable={!loading}
            maxLength={100}
          />
          {errors.title && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#dc2626" style={styles.errorIcon} />
              <Text style={styles.err}>{errors.title}</Text>
            </View>
          )}
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Campo: Descripción */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Descripción <Text style={styles.optional}>(opcional)</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.description && styles.inputError,
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              // Limpiar error al escribir
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            placeholder="Detalles adicionales de la tarea (opcional)"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!loading}
            maxLength={500}
          />
          {errors.description && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#dc2626" style={styles.errorIcon} />
              <Text style={styles.err}>{errors.description}</Text>
            </View>
          )}
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Botones de acción */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3b82f6"
            style={{ marginTop: 30, marginBottom: 40 }}
          />
        ) : (
          <View style={styles.actions}>
            {/* Guardar */}
            <Pressable
              style={[
                styles.btn,
                styles.btnPrimary,
                (!title.trim()) && styles.btnDisabled,
              ]}
              onPress={save}
              disabled={!title.trim()}
            >
              <Save size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnTxt}>Guardar Tarea</Text>
            </Pressable>

            {/* Cancelar */}
            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={handleCancel}>
              <ArrowLeft size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnTxt}>Cancelar</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  headerIcon: {
    marginTop: 4,
  },
  headerText: {
    flex: 1,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
    fontWeight: "700",
  },
  optional: {
    color: "#9ca3af",
    fontWeight: "400",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#111",
  },
  inputError: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "right",
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorIcon: {
    marginRight: 2,
  },
  err: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  actions: {
    marginTop: 12,
    marginBottom: 40,
  },
  btn: {
    marginTop: 12,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  btnIcon: {
    marginRight: 4,
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
  },
  btnSecondary: {
    backgroundColor: "#6b7280",
  },
  btnDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  btnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});