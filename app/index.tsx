import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTaskStore } from "../lib/context/TaskContext";

export default function IndexScreen() {
  const router = useRouter();
  const { tasks } = useTaskStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Tareas registradas: {tasks.length}</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/LoginScreen")}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#444" }]}
        onPress={() => router.push("/TaskForm")}
      >
        <Text style={styles.buttonText}>Crear Tarea</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 14,
    marginTop: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
