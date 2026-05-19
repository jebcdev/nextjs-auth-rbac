"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { registerSchema, RegisterData } from "../validations";
import { IGeneralResponse } from "@/features/shared/types/general-response";
import { User } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";
import { prismaDB } from "@/lib/db/prismaDB";

export const RegisterAction = async (
    data: RegisterData,
): Promise<IGeneralResponse<User>> => {
    try {
        const isValidData = registerSchema.safeParse(data);

        if (!isValidData.success) {
            return {
                success: false,
                error: true,
                message: "Datos de registro no válidos.",
            };
        }

        const { email, password, name } = isValidData.data;

        const existingUser = await prismaDB.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return {
                success: false,
                error: true,
                message: "El email ya está registrado.",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prismaDB.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return {
            success: true,
            error: false,
            message: "Usuario creado exitosamente.",
            data: newUser,
        };
    } catch (error) {
        consoleLogger({ "RegisterAction error": error });

        return {
            success: false,
            error: true,
            message: "Ocurrió un error durante el registro.",
        };
    }
};
