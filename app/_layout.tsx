import { Stack } from "expo-router";
import { TaskProvider } from "../lib/context/TaskContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#3b82f6" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Mis Tareas" }} />
        <Stack.Screen name="task/[id]" options={{ title: "Detalles" }} />
        <Stack.Screen name="TaskEdit" options={{ title: "Editar Tarea" }} />
        <Stack.Screen name="TaskForm" options={{ title: "Nueva Tarea" }} />
      </Stack>
    </TaskProvider>
  );
}
