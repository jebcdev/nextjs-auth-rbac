// src/features/shared/actions/get-current-session.action.ts

"use server";

import { getSessionCookie } from "@/lib/utils/cookie.util";
import { verifyToken } from "@/lib/utils/jwt.util";
import { prismaDB } from "@/lib/db/prismaDB";
import { CurrentSessionResult } from "@/features/shared/types/auth.type";
import { consoleLogger } from "@/lib/logger/console-logger";

const unauthenticated: CurrentSessionResult = {
    isAuthenticated: false,
    isAdmin: false,
    isRegularUser: false,
    role: null,
    currentUser: null,
};

export const getCurrentSessionAction =
    async (): Promise<CurrentSessionResult> => {
        try {
            // ── 1. Leer cookie ───────────────────────────────────────────────
            const token = await getSessionCookie();
            consoleLogger({ "[Session] 1 - token": token ? "existe" : "NO existe" });

            if (!token) return unauthenticated;

            // ── 2. Verificar JWT ─────────────────────────────────────────────
            const payload = verifyToken(token);
            consoleLogger({ "[Session] 2 - payload": payload ?? "INVÁLIDO o EXPIRADO" });

            if (!payload) return unauthenticated;

            // ── 3. Buscar sesión en BD ───────────────────────────────────────
            const session = await prismaDB.session.findUnique({
                where: { token },
                select: { isActive: true, expiresAt: true },
            });
            consoleLogger({ "[Session] 3 - session en BD": session ?? "NO ENCONTRADA" });

            if (!session) {
                consoleLogger({ "[Session] 3 - resultado": "sesión no existe en BD" });
                return unauthenticated;
            }

            if (!session.isActive) {
                consoleLogger({ "[Session] 3 - resultado": "sesión revocada (isActive: false)" });
                return unauthenticated;
            }

            // ── 4. Verificar expiración en BD ────────────────────────────────
            const ahora = new Date();
            consoleLogger({
                "[Session] 4 - expiresAt": session.expiresAt,
                "[Session] 4 - ahora": ahora,
                "[Session] 4 - expirada": session.expiresAt < ahora,
            });

            if (session.expiresAt < ahora) return unauthenticated;

            // ── 5. Verificar usuario activo en BD ────────────────────────────
            const user = await prismaDB.user.findUnique({
                where: { id: payload.sub },
                select: { isActive: true },
            });
            consoleLogger({ "[Session] 5 - user en BD": user ?? "NO ENCONTRADO" });

            if (!user || !user.isActive) return unauthenticated;

            // ── 6. Todo OK ───────────────────────────────────────────────────
            consoleLogger({ "[Session] 6 - resultado": "AUTENTICADO ✓" });

            return {
                isAuthenticated: true,
                isAdmin: payload.role === "ADMIN",
                isRegularUser: payload.role === "USER",
                role: payload.role,
                currentUser: payload,
            };

        } catch (error) {
            consoleLogger({ "[Session] ERROR inesperado": error });
            return unauthenticated;
        }
    };