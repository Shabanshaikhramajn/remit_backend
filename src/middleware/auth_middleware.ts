import type { NextFunction, Request, Response }  from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
    userId: string;
}

export const requireAuth = (
    req: Request,
    res: Response,
    next : NextFunction
): void => {
    const authorization = req.headers.authorization;
    if(!authorization || !authorization.startsWith("Bearer ")){
        res.status(401).json({
            message: "Authorization token is required"
        });
        return;
    }

    const token = authorization.substring("Bearer ".length).trim();
    if(!token){
        res.status(401).json({
            message: "Authorization token is required".
        });
        return;
    }

    try {
        const payload = verifyAccessToken(token);
        (req as AuthenticatedRequest).userId = payload.userId
        next();
    } catch {
        res.status(401).json({
            message: "Invalid or expired access token",
        })
    }
}


