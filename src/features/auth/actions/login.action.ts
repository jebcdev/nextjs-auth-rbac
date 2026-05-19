"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { LoginData, loginSchema } from "../validations";
import { IGeneralResponse } from "@/features/shared/types/general-response";
import { CurrentSession, JwtPayload } from "@/features/shared/types/auth.type";
import { generateToken } from "@/lib/utils/jwt.util";
import { setSessionCookie } from "@/lib/utils/cookie.util";
import { prismaDB } from "@/lib/db/prismaDB";
import bcrypt from "bcryptjs";

export const LoginAction = async (
    data: LoginData,
): Promise<IGeneralResponse<CurrentSession>> => {
    try {
        // ── 1. Validar datos de entrada ──────────────────────────────────────
        const isValidData = loginSchema.safeParse(data);

        if (!isValidData.success) {
            return {
                success: false,
                error: true,
                message: "Datos de inicio de sesión no válidos.",
            };
        }

        const { email, password } = isValidData.data;

        // ── 2. Buscar usuario ────────────────────────────────────────────────
        const existingUser = await prismaDB.user.findUnique({
            where: { email },
        });

        // Mensaje genérico intencional: no revelar si el email existe
        if (!existingUser) {
            return {
                success: false,
                error: true,
                message: "Datos de inicio de sesión no válidos.",
            };
        }

        // ── 3. Verificar que la cuenta esté activa ───────────────────────────
        if (!existingUser.isActive) {
            return {
                success: false,
                error: true,
                message: "Tu cuenta está suspendida. Contacta al administrador.",
            };
        }

        // ── 4. Verificar contraseña ──────────────────────────────────────────
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password,
        );

        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: "Datos de inicio de sesión no válidos.",
            };
        }

        // ── 5. Construir JwtPayload (sin password ni datos sensibles) ─────────
        // sub = user id, siguiendo el estándar JWT (RFC 7519)
        const jwtPayload: JwtPayload = {
            sub: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            isActive: existingUser.isActive,
        };

        // ── 6. Generar JWT ───────────────────────────────────────────────────
        const { token, expiresAt } = generateToken(jwtPayload);

        // ── 7. Persistir sesión en BD ────────────────────────────────────────
        await prismaDB.session.create({
            data: {
                token,
                expiresAt,
                userId: existingUser.id,
            },
        });

        // ── 8. Guardar en cookie httpOnly ────────────────────────────────────
        await setSessionCookie(token, expiresAt);

        // ── 9. Retornar CurrentSession ───────────────────────────────────────
        const currentSession: CurrentSession = {
            user: jwtPayload,
            token,
            expiresAt,
        };

        return {
            success: true,
            error: false,
            message: "Inicio de sesión exitoso.",
            data: currentSession,
        };

    } catch (error) {
        consoleLogger({ "LoginAction error": error });

        return {
            success: false,
            error: true,
            message: "Ocurrió un error durante el inicio de sesión.",
        };
    }
};