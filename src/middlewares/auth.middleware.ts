import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "chief" | "danru" | "anggota" | "admin";
        username: string;
      };
    }
  }
}

export const protectRoute = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // receive the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // if the token is not provided, return 401 Unauthorized
  if (!token) {
    res.status(401).json({ message: "Unauthorized, token not provided" });
    return;
  }

  // verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized, token expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Unauthorized, invalid token" });
      }
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }
    // if the token is valid, attach the user information to the request object
    req.user = user as {
      id: string;
      role: "chief" | "danru" | "anggota" | "admin";
      username: string;
    };
    // call the next middleware
    next();
  });
};

export const roleApproved = (
  roles: ("chief" | "danru" | "anggota" | "admin")[]
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden access, roles not assigned" });
      return;
    }

    next();
  };
};
