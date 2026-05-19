"use client";

import Link from "next/link";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

import {
    buttonVariants,
    Avatar,
    AvatarFallback,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/features/shared/components/ui";
import { LogOut, User, LayoutDashboard, Home } from "lucide-react";
import { LogoutAction } from "@/features/shared/actions";

interface Props {
    isAuthenticated: boolean;
    isAdmin: boolean;
    isRegularUser: boolean;
    userName: string;
    role: string;
}

// Genera un color de avatar consistente basado en el nombre
// Mismo nombre = siempre el mismo color
const getAvatarColor = (name: string): string => {
    const colors = [
        "bg-indigo-500",
        "bg-teal-600",
        "bg-rose-500",
        "bg-amber-500",
        "bg-sky-500",
        "bg-violet-500",
        "bg-emerald-600",
    ];
    if (!name) return colors[0];
    const index =
        name
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        colors.length;
    return colors[index];
};

export default function PublicNavbar({
    isAuthenticated,
    isAdmin,
    isRegularUser,
    userName,
}: Props) {
    const [isPending, startTransition] = useTransition();

    const getInitial = (name: string) =>
        name ? name.charAt(0).toUpperCase() : "U";

    const getProfileUrl = () => {
        if (isAdmin) return "/dashboard";
        if (isRegularUser) return "/user/profile";
        return "/";
    };

    const handleLogout = () => {
        startTransition(async () => {
            await LogoutAction();
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-card p-2">
            <div className="container max-w-7xl mx-auto flex h-14 items-center justify-between px-6">
                {/* LOGO */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
                >
                    <span className="bg-linear-to-r from-indigo-500 to-purple-500 w-5 h-5 rounded-md inline-block" />
                    <span>MiApp</span>
                </Link>

                {/* NAVEGACIÓN */}
                <nav className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        // ── Sin sesión: botones de login / registro ──────────
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    }),
                                    "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href="/register"
                                className={cn(
                                    buttonVariants({
                                        variant: "default",
                                        size: "sm",
                                    }),
                                    "bg-foreground text-background hover:bg-foreground/95 shadow-sm",
                                )}
                            >
                                Registrarse
                            </Link>
                        </div>
                    ) : (
                        // ── Con sesión: avatar + dropdown ────────────────────
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
                                <Avatar className="h-8 w-8 border-2 border-white/15 hover:opacity-85 transition-opacity">
                                    <AvatarFallback
                                        className={cn(
                                            "text-white text-xs font-semibold",
                                            getAvatarColor(userName),
                                        )}
                                    >
                                        {getInitial(userName)}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 mt-2 border-border/50 bg-popover/95 backdrop-blur-sm"
                            >
                                {/* Nombre del usuario */}
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback
                                                className={cn(
                                                    "text-white text-xs font-semibold",
                                                    getAvatarColor(
                                                        userName,
                                                    ),
                                                )}
                                            >
                                                {getInitial(userName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium leading-none text-foreground">
                                                {userName}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground mt-1">
                                                Conectado
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                {/* Inicio */}
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link
                                        href="/"
                                        className="flex items-center"
                                    >
                                        <Home className="mr-2 h-4 w-4 opacity-70" />
                                        <span>Inicio</span>
                                    </Link>
                                </DropdownMenuItem>

                                {/* Dashboard o Perfil según rol */}
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link
                                        href={getProfileUrl()}
                                        className="flex items-center"
                                    >
                                        {isAdmin ? (
                                            <LayoutDashboard className="mr-2 h-4 w-4 opacity-70" />
                                        ) : (
                                            <User className="mr-2 h-4 w-4 opacity-70" />
                                        )}
                                        <span>
                                            {isAdmin
                                                ? "Panel de Control"
                                                : "Mi Perfil"}
                                        </span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Cerrar sesión */}
                                <DropdownMenuItem
                                    disabled={isPending}
                                    onSelect={(e) => {
                                        e.preventDefault(); // evita que Radix cierre el menú antes de que termine el action
                                        handleLogout();
                                    }}
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>
                                        {isPending
                                            ? "Cerrando sesión..."
                                            : "Cerrar sesión"}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </nav>
            </div>
        </header>
    );
}
