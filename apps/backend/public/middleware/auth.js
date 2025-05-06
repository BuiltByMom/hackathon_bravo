"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log('🔴 [AUTH] No authorization header provided');
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('🔴 [AUTH] Invalid token format');
            res.status(401).json({ error: 'Invalid token format' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error('🔴 [AUTH] Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
