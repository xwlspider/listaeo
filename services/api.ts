// app/services/api.ts
import axios from "axios";

const API_URL =
  "https://3000-firebase-listaeo-1763405405695.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev";

// TIPOS
export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
}

// ====================================
// GET ALL - Obtener todas las tareas 📥
// ====================================
export async function fetchTasks(): Promise<TaskDTO[]> {
  try {
    const response = await axios.get<TaskDTO[]>(`${API_URL}/tasks`);
    console.log("✅ Tareas obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener tareas:", error);
    throw error;
  }
}

// ====================================
// POST - Crear nueva tarea 📤
// ====================================
export async function createTask(
  task: Omit<TaskDTO, "id" | "createdAt" | "done">
): Promise<TaskDTO> {
  try {
    const newTask = {
      ...task,
      done: false,
      createdAt: new Date().toISOString(),
    };
    
    const response = await axios.post<TaskDTO>(`${API_URL}/tasks`, newTask);
    console.log("✅ Tarea creada:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear tarea:", error);
    throw error;
  }
}

// ====================================
// PUT - Actualizar tarea completa ✏️
// ====================================
export async function updateTask(
  id: number,
  data: Partial<TaskDTO>
): Promise<TaskDTO> {
  try {
    const response = await axios.put<TaskDTO>(`${API_URL}/tasks/${id}`, data);
    console.log(`✅ Tarea ${id} actualizada:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar tarea ${id}:`, error);
    throw error;
  }
}

// ====================================
// DELETE - Eliminar tarea 🗑️
// ====================================
export async function deleteTask(id: number): Promise<void> {
  const url = `${API_URL}/tasks/${id}`;
  
  try {
    console.log("🔄 Intentando eliminar URL:", url);
    const response = await axios.delete(url);
    console.log(`✅ Tarea ${id} eliminada exitosamente`, response.status);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Error al eliminar tarea ${id}:`, {
        mensaje: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } else {
      console.error(`❌ Error desconocido:`, error);
    }
    throw error;
  }
}