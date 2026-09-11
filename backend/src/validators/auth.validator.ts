import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),

  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  email: z.string().trim().email("Adresse e-mail invalide").toLowerCase(),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),

  phone: z.string().trim().optional(),

});

export type RegisterInput = z.infer<typeof registerSchema>;

//=================== LOGIN SCHEMA =====================

export const loginSchema = z.object({
  email: z.string().trim().email("Adress email invalid").toLowerCase(),

  password: z.string().min(1, "Le mot de pass est obligatoire"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const googleLoginSchema = z.object({
  credential: z.string().min(1, "Le token Google est obligatoire"),
});

export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
