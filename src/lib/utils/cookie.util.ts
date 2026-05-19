// src/lib/utils/cookie.util.ts

import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME =
    process.env.SESSION_COOKIE_NAME || "auth_session";

/**
 * Guarda el JWT en una cookie httpOnly.
 * - httpOnly: JavaScript del cliente NO puede leerla (protección XSS)
 * - secure: solo HTTPS en producción
 * - sameSite: "lax" protege contra CSRF básico
 */
export const setSessionCookie = async (
    token: string,
    expiresAt: Date,
): Promise<void> => {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
};

/**
 * Lee el JWT de la cookie.
 * Retorna el token string o null si no existe.
 */
export const getSessionCookie = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    return cookie?.value ?? null;
};

/**
 * Elimina la cookie de sesión (logout).
 */
export const deleteSessionCookie = async (): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
};
