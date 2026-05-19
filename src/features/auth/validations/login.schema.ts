import z from "zod";

export const loginSchema = z.object({
    email: z
        .string({ error: "El email es requerido" })
        .trim()
        .email("Email no válido"),

    password: z
        .string({ error: "La contraseña es requerida" })
        .trim()
        .min(8, { error: "Mínimo 8 caracteres" }),
});

export type LoginData = z.infer<typeof loginSchema>;
