import { z } from "zod";

const safeTextRegex = /^[\p{L}\p{N} .,\-_:()¡!¿?\n\r]+$/u;

export const taskCreateSchema = z.object({
  title: z
    .string()
    .min(1, "El título no puede estar vacío.")
    .max(100, "Máx 100 caracteres.")
    .regex(safeTextRegex, "Solo letras, números y símbolos básicos."),

  description: z
    .string()
    .min(1, "La descripción no puede estar vacía.")
    .max(500, "Máx 500 caracteres.")
    .regex(safeTextRegex, "Solo letras, números y símbolos básicos."),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
