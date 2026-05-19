"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "../validations";

import {
    Input,
    Label,
    Button,
    SingleFormError,
} from "@/features/shared/components/ui"; // shadcn
import { consoleLogger } from "@/lib/logger/console-logger";
import { toast } from "sonner";
import { LoginAction } from "../actions";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur", // valida on change + on blur + on submit
    });

    const onSubmit = async (data: LoginData) => {
        try {
            const validData = loginSchema.parse(data); // Validación adicional con Zod

            if (!validData)
                return toast.error(
                    "Datos inválidos. Por favor, revisa el formulario.",
                    {
                        position: "top-left",
                        action: {
                            label: "Entendido",
                            onClick: () => toast.dismiss(),
                        },
                    },
                );

            const response = await LoginAction(validData);

            if (!response.success || !response.data || response.error)
                return toast.error(
                    "Datos inválidos. Por favor, revisa el formulario.",
                    {
                        position: "top-left",
                        action: {
                            label: "Entendido",
                            onClick: () => toast.dismiss(),
                        },
                    },
                );

            if (response.data.user.role === "ADMIN") {
                router.push("/dashboard");
                router.refresh();
            }
            if (response.data.user.role === "USER") {
                router.push("/user/profile");
                router.refresh();
            }
            toast.success("¡Inicio de sesión exitoso!", {
                description:
                    "Bienvenido de nuevo. Redirigiendo a tu dashboard...",
                position: "top-left",
                action: {
                    label: "Entendido",
                    onClick: () => toast.dismiss(),
                },
            });
        } catch (error) {
            consoleLogger({ loginFormError: error });
            toast.error(
                "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
                {
                    position: "top-left",
                    action: {
                        label: "Entendido",
                        onClick: () => toast.dismiss(),
                    },
                },
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4"
        >
            {/* Campo genérico */}
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="juan@example.com"
                    {...register("email")}
                />
                <SingleFormError message={errors.email?.message} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                />
                <SingleFormError message={errors.password?.message} />
            </div>

            <div className="space-y-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                    ¿No tienes una cuenta?{" "}
                    <a
                        href="/register"
                        className="text-primary hover:underline"
                    >
                        Regístrate
                    </a>
                </p>
            </div>
        </form>
    );
};
