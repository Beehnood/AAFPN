import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  googleLoginSchema,
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";

// ============= REGISTER ===========

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    const { firstName, lastName, email, password, phone } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};

//============== LOGIN =================

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });

      return;
    }

    if (!user.passwordHash) {
      res.status(401).json({
        success: false,
        message: "Ce compte utilise la connexion Google",
      });
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });

      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Ce compte est désactivé",
      });

      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET est manquant dans .env");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};

// =================== ME ==================

export const me = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Me error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};

// ================= GOOGLE LOGIN =================

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = googleLoginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Token Google manquant ou invalide",
      });
      return;
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      throw new Error("GOOGLE_CLIENT_ID est manquant dans .env");
    }

    const googleClient = new OAuth2Client(googleClientId);

    const ticket = await googleClient.verifyIdToken({
      idToken: result.data.credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(401).json({
        success: false,
        message: "Token Google invalide",
      });
      return;
    }

    const {
      sub,
      email,
      email_verified,
      given_name,
      family_name,
      picture,
      hd,
    } = payload;

    if (!email || !email_verified) {
      res.status(401).json({
        success: false,
        message: "L'adresse email Google n'est pas vérifiée",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase();

    let user = await prisma.user.findUnique({
      where: {
        googleId: sub,
      },
    });

    if (!user) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser) {
        // Google est considéré comme autoritaire pour Gmail
        // ou Google Workspace.
        const googleIsAuthoritative =
          normalizedEmail.endsWith("@gmail.com") ||
          Boolean(hd);

        if (!googleIsAuthoritative) {
          res.status(409).json({
            success: false,
            message:
              "Un compte existe déjà avec cette adresse. Connectez-vous d'abord avec votre mot de passe.",
          });
          return;
        }

        user = await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            googleId: sub,
            avatarUrl: picture ?? existingUser.avatarUrl,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            googleId: sub,
            email: normalizedEmail,

            firstName:
              given_name?.trim() || "Utilisateur",

            lastName:
              family_name?.trim() || "",

            avatarUrl: picture ?? null,
            passwordHash: null,
            isActive: true,
          },
        });
      }
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Ce compte est désactivé",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET est manquant dans .env");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Connexion Google réussie",

      token,

      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};
