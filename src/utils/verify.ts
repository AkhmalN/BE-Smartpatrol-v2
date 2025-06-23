import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

export interface JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new Error("Token tidak valid atau sudah kedaluwarsa");
  }
}
