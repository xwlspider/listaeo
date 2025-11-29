// lib/schemas/TaskSchemas.ts
import { z } from "zod";

// Regex para texto seguro (previene inyecciones)
const safeTextRegex = /^[\p{L}\p{N} .,\-_:()¡!¿?\n\r]+$/u;

// ====================================
// SCHEMA PARA CREAR TAREA

export const taskCreateSchema = z.object({
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(100, "El título no puede exceder 100 caracteres")
    .regex(safeTextRegex, "Solo se permiten letras, números y símbolos básicos")
    .transform((val) => val.trim()), // Elimina espacios automáticamente

  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .regex(safeTextRegex, "Solo se permiten letras, números y símbolos básicos")
    .optional() // ES OPCIONAL
    .or(z.literal("")) // Permite strings vacíos
    .transform((val) => (val ? val.trim() : "")), // Si está vacío, devuelve ""
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;

// ====================================
// SCHEMA PARA EDITAR TAREA
// ====================================
export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(100, "El título no puede exceder 100 caracteres")
    .regex(safeTextRegex, "Solo se permiten letras, números y símbolos básicos")
    .transform((val) => val.trim())
    .optional(),

  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .regex(safeTextRegex, "Solo se permiten letras, números y símbolos básicos")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val ? val.trim() : "")),

  done: z.boolean().optional(),
});

export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

