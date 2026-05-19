// src/features/shared/types/auth.types.ts

/**
 * Payload del JWT y representación del usuario en sesión activa.
 * Es la única fuente de verdad — la usa jwt.util, Zustand y el middleware.
 */
export interface JwtPayload {
    sub: string;      // user id
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    iat?: number;     // issued at  — lo asigna jwt.sign automáticamente
    exp?: number;     // expiration — lo asigna jwt.sign automáticamente
}

/**
 * Respuesta del LoginAction y lo que Zustand persiste en memoria.
 */
export interface CurrentSession {
    user: JwtPayload;
    token: string;
    expiresAt: Date;
}



export interface CurrentSessionResult {
    isAuthenticated: boolean;   // ¿tiene sesión válida?
    isAdmin: boolean;           // ¿es ADMIN?
    isRegularUser: boolean;     // ¿es USER normal?
    role: string | null;        // rol en crudo, por si necesitas más granularidad
    currentUser: JwtPayload | null; // datos del usuario, null si no autenticado
}