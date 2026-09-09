import type { NextFunction, Response } from "express";
import type { Role } from "../generated/prisma/client.js";
import type { AuthRequest } from "./auth.middleware.js";

export const authorizeRoles =
  (...allowedRoles: Role[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });

      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Accès interdit",
      });

      return;
    }

    next();
  };