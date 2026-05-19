import { JwtPayload } from "@/features/shared/types";
import {
    Avatar,
    AvatarFallback,
    Badge,
    Card,
    CardContent,
    CardHeader,
} from "@/features/shared/components/ui";

import {
    CalendarDays,
    Mail,
    Shield,
    Fingerprint,
} from "lucide-react";

interface Props {
    data: JwtPayload;
}

export const ProfileCard = ({ data }: Props) => {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString(
            "es-ES",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            },
        );
    };

    const getInitial = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    return (
        <Card className="w-full max-w-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl transition-all duration-300">
            {/* Header decorativo más alto para dar aire visual */}
            <div className="h-32 w-full bg-linear-to-r from-zinc-900 via-zinc-850 to-zinc-900 border-b border-zinc-800/40" />

            {/* Ajuste de padding inferior en el header */}
            <CardHeader className="relative flex flex-col items-center pt-0 pb-6 px-6 sm:px-8">
                {/* Avatar más imponente y flotante */}
                <Avatar className="h-24 w-24 -mt-12 border-4 border-zinc-950 bg-zinc-900 shadow-2xl ring-1 ring-zinc-800/50">
                    <AvatarFallback className="bg-zinc-800 text-zinc-100 text-2xl font-bold tracking-wider">
                        {getInitial(data.name)}
                    </AvatarFallback>
                </Avatar>

                {/* Nombre y Badges con mejor tracking */}
                <div className="mt-4 text-center space-y-2.5">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                        {data.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2.5">
                        <Badge
                            variant="secondary"
                            className="bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono text-[11px] uppercase tracking-wider px-2.5 py-1"
                        >
                            <Shield className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
                            {data.role}
                        </Badge>

                        {data.isActive && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[11px] tracking-wide px-2.5 py-1">
                                <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Activo
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            {/* Contenido principal con Grid responsivo */}
            <CardContent className="px-6 pb-8 pt-4 sm:px-8 text-sm text-zinc-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    
                    {/* Correo Electrónico */}
                    <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/30 border border-zinc-900/50">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                Correo Electrónico
                            </span>
                            <span className="text-zinc-200 font-medium break-all mt-0.5">
                                {data.email}
                            </span>
                        </div>
                    </div>

                    {/* Sesión Iniciada */}
                    <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/30 border border-zinc-900/50">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                            <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                Sesión Iniciada
                            </span>
                            <span className="text-zinc-200 font-medium mt-0.5">
                                {data.iat ? formatDate(data.iat) : "Desconocido"}
                            </span>
                        </div>
                    </div>

                    {/* ID de Usuario (Ocupa las 2 columnas en pantallas medianas/grandes) */}
                    <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/30 border border-zinc-900/50 md:col-span-2">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                            <Fingerprint className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                ID de Usuario (SUB)
                            </span>
                            <span className="text-zinc-300 font-mono text-xs truncate bg-zinc-900 border border-zinc-800/60 px-2 py-1 rounded-md select-all block w-full mt-1.5 transition-colors hover:border-zinc-700">
                                {data.sub}
                            </span>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};