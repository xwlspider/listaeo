// app/TaskContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    TaskDTO,
    createTask as apiCreateTask,
    deleteTask as apiDeleteTask,
    updateTask as apiUpdate,
    fetchTasks,
} from "../../services/api";

type ContextValue = {
  tasks: TaskDTO[];
  loading: boolean;
  refresh: () => Promise<void>;
  addTask: (task: Omit<TaskDTO, "id" | "createdAt">) => Promise<void>;
  editTask: (id: number, task: Omit<TaskDTO, "id" | "createdAt">) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
};

const TaskContext = createContext<ContextValue | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      console.warn("fetch tasks error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addTask = async (task: Omit<TaskDTO, "id" | "createdAt">) => {
    const created = await apiCreateTask({
      ...task,
      createdAt: new Date().toISOString(), // FIX
    });
    setTasks((prev) => [created, ...prev]);
  };

  const editTask = async (id: number, task: Omit<TaskDTO, "id" | "createdAt">) => {
    const updated = await apiUpdate(id, {
      ...task,
      createdAt: new Date().toISOString(),
      id: 0
    });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const removeTask = async (id: number) => {
    await apiDeleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, refresh, addTask, editTask, removeTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTaskStore() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskStore debe usarse dentro de <TaskProvider>");
  return ctx;
}





