import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Le titre doit contenir au moins 3 caractères"),
    description: z
      .string()
      .trim()
      .min(10, "La description doit contenir au moins 10 caractères"),
    location: z.string().trim().optional(),
    imageUrl: z.string().url("URL de l'image invalide").optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date().optional(),
    capacity: z.coerce.number().int().positive().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).default("DRAFT"),
  })
  .refine(
    (data) => !data.endAt || data.endAt > data.startAt,
    {
      message: "La date de fin doit être après la date de début",
      path: ["endAt"],
    },
  );

//=============== UPDATE EVENT =================

  export const updateEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères")
    .optional(),

  location: z.string().trim().optional(),

  imageUrl: z
    .string()
    .url("URL de l'image invalide")
    .optional(),

  startAt: z.coerce.date().optional(),

  endAt: z.coerce.date().optional(),

  capacity: z
    .number()
    .int()
    .positive()
    .optional(),

  status: z
    .enum(["DRAFT", "PUBLISHED", "CANCELLED"])
    .optional(),
});
