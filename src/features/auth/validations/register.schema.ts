import z from "zod";

export const registerSchema = z.object({
     name: z
        .string({ error: "El nombre es requerido" })
        .trim()
        .min(3, { error: "Mínimo 3 caracteres" }),

    email: z
        .string({ error: "El email es requerido" })
        .trim()
        .email("Email no válido"),

    password: z
        .string({ error: "La contraseña es requerida" })
        .trim()
        .min(8, { error: "Mínimo 8 caracteres" }),

    passwordConfirmation: z
        .string({ error: "Confirma tu contraseña" })
        .trim()
        .min(8, { error: "Mínimo 8 caracteres" }),
})
.refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"], // <- el campo donde aparece el error
});

export type RegisterData = z.infer<typeof registerSchema>;