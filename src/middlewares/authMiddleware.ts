import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';
import { AuthUser } from '../types/auth.types';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        sendError(res, 401, 'Akses ditolak. Token tidak ditemukan!');
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        };
        res.locals.userId = decoded.id;
        next();
    } catch (error) {
        sendError(res, 403, 'Sesi tidak valid atau kedaluwarsa!');
    }
};
