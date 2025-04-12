"use strict";
// src/middleware/role.middleware.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
exports.checkRole = checkRole;
