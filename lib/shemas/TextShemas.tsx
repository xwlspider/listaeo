import { z } from 'zod';
import { TextMessage } from '../shemas/TextMessage';

export const nameSchema = z
  .string()
  .min(5, TextMessage.nameInvalid)
  .regex(/^[A-Za-z0-9]+$/, TextMessage.nameInvalid);

export const emailSchema = z
  .string()
  .email(TextMessage.emailInvalid);

export const passwordSchema = z
  .string()
  .min(8, TextMessage.passwordWeak)
  .regex(/[A-Z]/, TextMessage.passwordWeak)
  .regex(/[0-9]/, TextMessage.passwordWeak)
  .regex(/[^A-Za-z0-9]/, TextMessage.passwordWeak);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

