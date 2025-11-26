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
      />
    </TaskProvider>
  );
}
