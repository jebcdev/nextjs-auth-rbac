// src/features/auth/actions/logout.action.ts

"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { getSessionCookie, deleteSessionCookie } from "@/lib/utils/cookie.util";
import { prismaDB } from "@/lib/db/prismaDB";
import { redirect } from "next/navigation";

export const LogoutAction = async (): Promise<void> => {
    try {
        // ── 1. Leer token ────────────────────────────────────────────────────
        const token = await getSessionCookie();
        consoleLogger({ "[Logout] 1 - token": token ? "existe" : "NO existe" });

        if (token) {
            // ── 2. Revocar sesión en BD ──────────────────────────────────────
            const revoked = await prismaDB.session.updateMany({
                where: { token },
                data: { isActive: false },
            });
            consoleLogger({ "[Logout] 2 - sesiones revocadas": revoked.count });
        }

        // ── 3. Borrar cookie ─────────────────────────────────────────────────
        await deleteSessionCookie();
        consoleLogger({ "[Logout] 3 - cookie": "eliminada" });

    } catch (error) {
        consoleLogger({ "[Logout] ERROR": error });
    } finally {
        consoleLogger({ "[Logout] 4 - redirigiendo a": "/login" });
        redirect("/login");
    }
};