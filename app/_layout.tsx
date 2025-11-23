import { Stack } from "expo-router";
import { TaskProvider } from "../lib/context/TaskContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <Stack />
    </TaskProvider>
  );
}

