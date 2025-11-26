import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/api";

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

interface TaskState {
  tasks: Task[];
}

type Action =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "EDIT_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: number };

const TaskContext = createContext<any>(null);

function reducer(state: TaskState, action: Action) {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

export function TaskProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, { tasks: [] });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await fetchTasks();
    dispatch({ type: "SET_TASKS", payload: data });
  };

  const addTask = async (task: { title: string; description: string }) => {
    const newTask = await createTask(task);
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const editTask = async (id: number, data: any) => {
    const updated = await updateTask(id, data);
    dispatch({ type: "EDIT_TASK", payload: updated });
  };

  // SOLO cambiar estado done, NO eliminar ni ocultar
  const toggleDone = async (id: number) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = await updateTask(id, { done: !task.done });
    dispatch({ type: "EDIT_TASK", payload: updated });
  };

  const removeTask = async (id: number) => {
    await deleteTask(id);
    dispatch({ type: "REMOVE_TASK", payload: id });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
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

export function useTaskStore() {
  return useContext(TaskContext);
}

export default TaskProvider;
