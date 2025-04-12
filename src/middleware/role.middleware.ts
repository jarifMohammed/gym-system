// src/middleware/role.middleware.js

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";

export const checkRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
