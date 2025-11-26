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

// GET ALL
export async function fetchTasks(): Promise<TaskDTO[]> {
  const res = await axios.get(`${API_URL}/tasks`);
  return res.data;
}

// POST
export async function createTask(
  task: Omit<TaskDTO, "id" | "createdAt" | "done">
): Promise<TaskDTO> {
  const res = await axios.post(`${API_URL}/tasks`, {
    ...task,
    done: false,
    createdAt: new Date().toISOString(),
  });
  return res.data;
}

// PUT
export async function updateTask(
  id: number,
  data: Partial<TaskDTO>
): Promise<TaskDTO> {
  const res = await axios.put(`${API_URL}/tasks/${id}`, data);
  return res.data;
}

// DELETE
export async function deleteTask(id: number): Promise<void> {
  await axios.delete(`${API_URL}/tasks/${id}`);
}
