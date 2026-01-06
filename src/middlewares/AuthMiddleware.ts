import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Type payload token
export interface AuthPayload extends JwtPayload {
  id: number;
  username: string;
  email?: string;
}

declare global {
  namespace Express {
    interface User extends AuthPayload {}
    interface Request {
      user?: User;
    }
  }
}

// Middleware Auth
export const Auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error(
        "JWT_SECRET_KEY is not defined in environment variables."
      );
    }

    const payload = jwt.verify(token, secret) as AuthPayload;

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
