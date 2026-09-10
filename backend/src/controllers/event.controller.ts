import type { Request, Response } from "express";
import slugify from "slugify";

import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { createEventSchema, updateEventSchema } from "../validators/event.validator.js";
import { success } from "zod";

// ========== GET PUBLIC EVENTS ==========

export const getEvents = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { startAt: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        location: true,
        startAt: true,
        endAt: true,
        capacity: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements",
    });
  }
};

// ========== GET EVENT BY SLUG ==========

export const getEventBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      res.status(400).json({
        success: false,
        message: "Slug invalide",
      });
      return;
    }

    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        location: true,
        startAt: true,
        endAt: true,
        capacity: true,
        status: true,
        createdAt: true,
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};


// ================== CREATE EVENT - ADMIN ==============
export const createEvent = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });

      return;
    }

    const result = createEventSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    const {
      title,
      description,
      imageUrl,
      location,
      startAt,
      endAt,
      capacity,
      status,
    } = result.data;

    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;

    const existingEvent = await prisma.event.findUnique({
      where: {
        slug,
      },
    });

    if (existingEvent) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        imageUrl,
        location,
        startAt,
        endAt,
        capacity,
        status,

        createdById: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'événement",
    });
  }
};

// ============= UPDATE EVENT - ADMIN ===============


export const updateEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam)
    ? idParam[0]
    : idParam;

    if(!id) {
        res.status(400).json({
            success: false,
            message: "identifiant de l'événement manquant",
        });

        return
    }

    const result = updateEventSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    const data = result.data;

    const finalStartAt = data.startAt ?? existingEvent.startAt;
    const finalEndAt = data.endAt ?? existingEvent.endAt;

    if (finalEndAt && finalEndAt <= finalStartAt) {
      res.status(400).json({
        success: false,
        message: "La date de fin doit être après la date de début",
      });
      return;
    }

    let slug = existingEvent.slug;

    if (data.title && data.title !== existingEvent.title) {
      const baseSlug = slugify(data.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      slug = baseSlug;

      const eventWithSameSlug = await prisma.event.findFirst({
        where: {
          slug: baseSlug,
          NOT: {
            id: existingEvent.id,
          },
        },
      });

      if (eventWithSameSlug) {
        slug = `${baseSlug}-${Date.now()}`;
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },

      data: {
        ...(data.title !== undefined && {
          title: data.title,
          slug,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.location !== undefined && {
          location: data.location,
        }),

        ...(data.imageUrl !== undefined && {
          imageUrl: data.imageUrl,
        }),

        ...(data.startAt !== undefined && {
          startAt: data.startAt,
        }),

        ...(data.endAt !== undefined && {
          endAt: data.endAt,
        }),

        ...(data.capacity !== undefined && {
          capacity: data.capacity,
        }),

        ...(data.status !== undefined && {
          status: data.status,
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Événement modifié avec succès",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de l'événement",
    });
  }
};


// ============= DELETE EVENT - ADMIN ===============

export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const idParam = req.params.id;

    const id = Array.isArray(idParam)
    ? idParam[0]
    : idParam;

    if(!id) {
        res.status(400).json({
            success: false,
            message: "Identifiant de l'evenment manquant",
        })
        
        return;
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    await prisma.event.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'événement",
    });
  }
};