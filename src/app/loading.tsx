"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
    message?: string;
    className?: string;
}

export default function Loading({
    message = "Cargando",
    className,
}: LoadingProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-6 py-20 w-full",
                className,
            )}
        >
            {/* Animated bars */}
            <div className="flex items-end gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className="w-0.5 bg-emerald-400 rounded-full animate-loading-bar"
                        style={{ animationDelay: `${i * 0.12}s` }}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-zinc-500 animate-pulse">
                {message}
                <span className="animate-ellipsis" />
            </p>
        </div>
    );
}