// lib/context/TaskContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  TaskDTO,
} from "../../services/api";

// ====================================
// TIPOS
// ====================================
interface TaskContextType {
  tasks: TaskDTO[];
  loadTasks: () => Promise<void>;
  addTask: (task: { title: string; description: string }) => Promise<void>;
  editTask: (id: number, data: Partial<TaskDTO>) => Promise<void>;
  toggleDone: (id: number) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
}

// ====================================
// CONTEXTO
// ====================================
const TaskContext = createContext<TaskContextType | null>(null);

// ====================================
// PROVIDER
// ====================================
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, []);

  // 📥 GET - Cargar todas las tareas
  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
    }
  };

  // 📤 POST - Agregar nueva tarea
  const addTask = async (task: { title: string; description: string }) => {
    try {
      const newTask = await createTask(task);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("❌ Error al agregar tarea:", error);
      throw error;
    }
  };

  // ✏️ PUT - Editar tarea completa
  const editTask = async (id: number, data: Partial<TaskDTO>) => {
    try {
      const updated = await updateTask(id, data);
      const newTasks = tasks.map((t) => (t.id === id ? updated : t));
      setTasks(newTasks);
    } catch (error) {
      console.error("❌ Error al editar tarea:", error);
      throw error;
    }
  };

  // ✅ Toggle - Cambiar estado "done"
  const toggleDone = async (id: number) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        console.warn(`⚠️ Tarea con id ${id} no encontrada`);
        return;
      }

      const updated = await updateTask(id, { done: !task.done });
      const newTasks = tasks.map((t) => (t.id === id ? updated : t));
      setTasks(newTasks);
    } catch (error) {
      console.error("❌ Error al cambiar estado de tarea:", error);
      throw error;
    }
  };

  // 🗑️ DELETE - Eliminar tarea
  const removeTask = async (id: number) => {
    try {
      // Primero eliminar del servidor
      await deleteTask(id);
      
      // Si fue exitoso, actualizar estado local
      const newTasks = tasks.filter((t) => t.id !== id);
      setTasks(newTasks);
      
      console.log(`✅ Tarea ${id} eliminada exitosamente`);
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadTasks,
        addTask,
        editTask,
        toggleDone,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// ====================================
// HOOK PERSONALIZADO
// ====================================
export function useTaskStore() {
  const context = useContext(TaskContext);
  
  if (!context) {
    throw new Error("useTaskStore debe usarse dentro de un TaskProvider");
  }
  
  return context;
}

export default TaskProvider;