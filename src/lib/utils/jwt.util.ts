// src/lib/utils/jwt.util.ts

import jwt from "jsonwebtoken";
import { JwtPayload } from "@/features/shared/types/";

// ─── Constantes ────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET no está definido en las variables de entorno.",
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Convierte el string de expiración ("7d", "1h", etc.)
 * en una fecha concreta para guardar en la BD.
 */
const parseExpiresAt = (expiresIn: string): Date => {
    const units: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
        // Si el formato no es reconocido, default 7 días
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const [, amount, unit] = match;
    return new Date(Date.now() + parseInt(amount) * units[unit]);
};

// ─── Funciones públicas ──────────────────────────────────────────────────────────

/**
 * Genera un JWT firmado a partir del payload del usuario.
 * Retorna el token y su fecha de expiración para persistir en BD.
 */
export const generateToken = (
    user: JwtPayload,
): { token: string; expiresAt: Date } => {
    // Extraemos solo los campos del dominio, sin iat/exp anteriores
    const payload: JwtPayload = {
        sub: user.sub,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    const expiresAt = parseExpiresAt(JWT_EXPIRES_IN);

    return { token, expiresAt };
};

/**
 * Verifica y decodifica un JWT.
 * Retorna el payload o null si es inválido / expirado.
 */
export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        // Token expirado, mal formado, firma inválida, etc.
        return null;
    }
};

/**
 * Decodifica el token SIN verificar la firma.
 * Útil solo para leer el payload en el cliente (nunca para autenticar).
 */
export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch {
        return null;
    }
};
