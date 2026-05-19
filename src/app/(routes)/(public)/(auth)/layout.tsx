import { getCurrentSessionAction } from "@/features/shared/actions";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, isAdmin, isRegularUser } =
        await getCurrentSessionAction();

    if (isAdmin) return redirect("/dashboard");
    if (isRegularUser) return redirect("/user/profile");

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8 text-foreground">
                Autenticación
            </h1>
            <div className="w-full max-w-md">{children}</div>
        </main>
    );
}
