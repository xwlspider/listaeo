// app/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://10.0.2.2:3000",
});

// TIPOS
export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

// GET ALL
export async function fetchTasks() {
  const res = await API.get("/tasks");
  return res.data;
}

// POST CREATE
export async function createTask(task: Omit<TaskDTO, "id" | "createdAt">) {
  const res = await API.post("/tasks", {
    ...task,
    createdAt: new Date().toISOString(),
  });
  return res.data;
}

// PUT UPDATE
export async function updateTask(id: number, task: Partial<TaskDTO>) {
  const res = await API.put(`/tasks/${id}`, task);
  return res.data;
}

// DELETE
export async function deleteTask(id: number) {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
}

